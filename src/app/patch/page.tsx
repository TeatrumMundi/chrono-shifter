import PatchNotesViewer from "@/components/patch/PatchNotesViewer";
import {getLatestPatchNotes} from "@/utils/patch/getLatestPatchNotes";
import Navbar from "@/components/common/Navbar";

export const dynamic = "force-dynamic";

export default async function PatchPage() {
    const patch = await getLatestPatchNotes();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-black text-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <PatchNotesViewer
                    patchVersion={patch.patchVersion}
                    changes={patch.changes}
                />
            </main>
        </div>
    );
}