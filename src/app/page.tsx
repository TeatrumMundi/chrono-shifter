export default function Home() {
    const randomNumber = Math.floor(Math.random() * 5)+1;
    return (
        <div className="relative bg-cover bg-center bg-no-repeat bg-overlay min-h-screen" style={{ backgroundImage: `url('/main/${randomNumber}.jpg')` }}>
            <div className="relative container mx-auto px-4 py-10">
                <div className="grid grid-cols-12 gap-[15px] w-[75%] mx-auto">
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white p-6 shadow-lg rounded-lg">
                        <h2 className="text-xl font-bold">Kolumna 1</h2>
                        <p>Treść pierwszej kolumny.</p>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white p-6 shadow-lg rounded-lg">
                        <h2 className="text-xl font-bold">Kolumna 2</h2>
                        <p>Treść drugiej kolumny.</p>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white p-6 shadow-lg rounded-lg">
                        <h2 className="text-xl font-bold">Kolumna 3</h2>
                        <p>Treść trzeciej kolumny.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
