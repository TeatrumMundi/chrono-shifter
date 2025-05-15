import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as cheerio from 'cheerio';
import { PrismaClient, Prisma } from '@prisma/client';
import {transformSectionContent} from "@/utils/patch/PatchNotesFormatter";

const prisma = new PrismaClient();

interface SectionContent {
    subtitle: string;
    changes: {
        name: string;
        changes: string[];
    }[];
}

interface Section {
    title: string;
    content: SectionContent[];
}

interface Params {
    language: string;
    version: string;
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { language, version } = await params;

    try {
        const cachedPatch = await prisma.patchNote.findUnique({
            where: {
                language_version: { language, version },
            },
        });

        if (cachedPatch) {
            return NextResponse.json(cachedPatch.data);
        }

        const url = `https://www.leagueoflegends.com/${language}/news/game-updates/patch-${version}-notes/`;
        const res = await fetch(url);

        if (!res.ok) {
            return NextResponse.json(
                { error: `Failed to fetch page. Status: ${res.status}. Tried to use this link for fetching url: ${url}` },
                { status: res.status }
            );
        }

        const html = await res.text();
        console.log('✅ HTML fetched successfully');
        const $ = cheerio.load(html);

        const title = $('h1[data-testid="title"]').text().trim() || `Patch ${version}`;
        const tagline = $('div[data-testid="tagline"]').find('span, em, strong, a').addBack().contents()
            .filter((_, el) => el.type === 'text')
            .map((_, el) => $(el).text().trim())
            .get()
            .filter(text => text.length > 0)
            .join(' ');
        const publishDate = $('time[datetime]').attr('datetime') ?? new Date().toISOString();

        const sections: Section[] = [];

        $('section[data-testid="RichTextPatchNotesBlade"] h2, section[data-testid="RichTextPatchNotesBlade"] div, section[data-testid="RichTextPatchNotesBlade"] header').each((_, element) => {
            const tag = $(element).prop('tagName') as string;

            if (tag === 'H2') {
                sections.push({
                    title: $(element).text().trim(),
                    content: [],
                });
            } else if (sections.length > 0) {
                const currentSection = sections[sections.length - 1];

                const text = $(element).text().trim();
                if (!text) return;

                // Do zagnieżdżonego przetwarzania później, zbierzemy surowe teksty
                if (!Array.isArray(currentSection.content)) {
                    currentSection.content = [];
                }

                (currentSection.content as unknown as string[]).push(text);
            }
        });

        // Przekształć sekcje przy użyciu funkcji transformującej
        const transformedSections: Section[] = sections.map(section => ({
            title: section.title,
            content: transformSectionContent(section.content as unknown as string[]),
        }));

        const data: Prisma.InputJsonValue = JSON.parse(JSON.stringify({
            title,
            tagline,
            publishDate,
            sections: transformedSections,
            sourceUrl: url,
        }));

         await prisma.patchNote.create({
           data: {
             language,
             version,
             title,
             publishDate: new Date(publishDate),
             sourceUrl: url,
             data,
           },
        });

        return NextResponse.json(data);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
