import { Header, Footer } from '@/components/layout';
import { SearchForm } from '@/components/search';
import { Background } from "@/components/common";


export default function Home() {
    return (
        <div className="relative min-h-dvh text-white overflow-hidden flex flex-col">
            <Background />
            <Header />
            <div className="flex-grow relative">
                <SearchForm />
            </div>
            <Footer />
        </div>
    );
}