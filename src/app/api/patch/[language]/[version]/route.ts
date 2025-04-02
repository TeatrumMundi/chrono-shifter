import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as cheerio from 'cheerio';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface ChampionChange {
    title: string;
    subtitle: string;
    items: string[];
}

interface Champion extends Record<string, unknown> {
    name: string;
    changes: ChampionChange[];
}

interface Section extends Record<string, unknown> {
    title: string;
    content: string[] | Champion[];
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
        const $ = cheerio.load(html);

        const title = $('h1[data-testid="title"]').text().trim() || `Patch ${version}`;
        const publishDate = $('time[datetime]').attr('datetime') || new Date().toISOString();

        const sections: Section[] = [];

        $('#patch-notes-container').children('h2, div, header').each((_, element) => {
            const tag = $(element).prop('tagName');

            if (tag === 'H2' || tag === 'HEADER') {
                sections.push({
                    title: $(element).text().trim(),
                    content: [],
                });
            }

            if (tag === 'DIV' && sections.length > 0) {
                const currentSection = sections[sections.length - 1];
                const contentText = $(element).text().trim().replace(/\s+/g, ' ');

                if (currentSection.title.toLowerCase().includes('champions')) {
                    $(element).find('.patch-change-block').each((_, patchBlock) => {
                        const $block = $(patchBlock);
                        const name = $block.find('.change-title').text().trim();
                        const structuredChanges: ChampionChange[] = [];

                        const blockTitle = $block.find('blockquote.blockquote.context').first().text().trim();

                        $block.find('.change-detail-title.ability-title').each((_, h4El) => {
                            const $h4 = $(h4El);
                            const subtitle = $h4.text().trim();
                            const items: string[] = [];

                            // Szukamy UL bezpośrednio po H4
                            let $ul = $h4.next();
                            while ($ul.length && $ul.prop('tagName') !== 'UL') {
                                $ul = $ul.next();
                            }

                            if ($ul.length) {
                                $ul.find('li').each((_, li) => {
                                    const itemText = $(li).text().trim().replace(/\s+/g, ' ');
                                    if (itemText) items.push(itemText);
                                });
                            }

                            structuredChanges.push({
                                title: blockTitle,
                                subtitle,
                                items,
                            });
                        });

                        if (name && structuredChanges.length > 0) {
                            (currentSection.content as Champion[]).push({ name, changes: structuredChanges });
                        }
                    });
                } else if (
                    currentSection.title.toLowerCase().includes('aram') ||
                    currentSection.title.toLowerCase().includes('arena')
                ) {
                    $(element).find('p, ul li, h4').each((_, specificElement) => {
                        const specificChange = $(specificElement).text().trim().replace(/\s+/g, ' ');
                        if (specificChange) (currentSection.content as string[]).push(specificChange);
                    });
                } else if (contentText) {
                    (currentSection.content as string[]).push(contentText);
                }
            }
        });

        // Structured final response data explicitly typed for Prisma
        const data: Prisma.InputJsonValue = JSON.parse(JSON.stringify({
            title,
            publishDate,
            sections,
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
