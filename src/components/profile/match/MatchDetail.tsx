import Image from "next/image";

export function MatchDetail({label, value, fullWidth = false, isImage = false}: {
    label: string;
    value: string;
    fullWidth?: boolean;
    isImage?: boolean
}) {
    return (
        <p className={`font-semibold text-gray-300 ${fullWidth ? "col-span-2" : ""}`}>
            {label}: {
            isImage ? (
                <Image
                    src={value}
                    alt={label}
                    width={32}
                    height={32}
                    className="inline-block rounded-full"
                />
            ) : (<span className="text-gray-400">{value}</span>)}
        </p>
    );
}