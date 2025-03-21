import { Header, Footer } from '@/components/layout';
import { SearchForm } from '@/components/search';
import { Background } from "@/components/common";


export default function Home() {
    return (
        <div className="relative min-h-screen text-white overflow-hidden">
            <Background />
            <Header />
            <SearchForm />
            <Footer />
        </div>
    );
}
