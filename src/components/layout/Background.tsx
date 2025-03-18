import {getRandomImage} from "@/utils/getRandomImage";

export function Background() {
    return (
        <div
            className="relative bg-cover bg-center bg-no-repeat min-h-screen text-white overflow-hidden"
            style={{
                backgroundImage: `url(${getRandomImage(12)})`,
                height: "100vh",
                minHeight: "450px",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-indigo-600/50"></div>
        </div>
    );
}