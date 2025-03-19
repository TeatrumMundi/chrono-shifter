export default function RegionSelector() {
    return (
        <select
            name="server"
            defaultValue="EUNE"
            className="pl-2 pr-6 py-2 text-xs xs:pl-3 xs:pr-8 xs:py-3 xs:text-sm sm:text-base md:text-lg lg:text-xl rounded-l-lg bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:border-white/50 text-white appearance-none tracking-[0.2em]"
            autoComplete="off"
        >
            <option value="REGION" disabled className="bg-blue-800/20 backdrop-blur-sm tracking-[0.2em]">
                REGION
            </option>
            <option value="NA" className="bg-blue-900/50 backdrop-blur-sm tracking-[0.2em]">NA</option>
            <option value="EUW" className="bg-indigo-800/50 backdrop-blur-sm tracking-[0.2em]">EUW</option>
            <option value="EUNE" className="bg-indigo-900/50 backdrop-blur-sm tracking-[0.2em]">EUNE</option>
            <option value="KR" className="bg-purple-800/50 backdrop-blur-sm tracking-[0.2em]">KR</option>
            <option value="BR" className="bg-purple-900/50 backdrop-blur-sm tracking-[0.2em]">BR</option>
            <option value="JP" className="bg-pink-800/50 backdrop-blur-sm tracking-[0.2em]">JP</option>
            <option value="RU" className="bg-pink-900/50 backdrop-blur-sm tracking-[0.2em]">RU</option>
            <option value="OCE" className="bg-teal-800/50 backdrop-blur-sm tracking-[0.2em]">OCE</option>
            <option value="TR" className="bg-teal-900/50 backdrop-blur-sm tracking-[0.2em]">TR</option>
            <option value="LAN" className="bg-rose-800/50 backdrop-blur-sm tracking-[0.2em]">LAN</option>
            <option value="LAS" className="bg-rose-900/50 backdrop-blur-sm tracking-[0.2em]">LAS</option>
            <option value="SEA" className="bg-cyan-800/50 backdrop-blur-sm tracking-[0.2em]">SEA</option>
            <option value="TW" className="bg-cyan-900/50 backdrop-blur-sm tracking-[0.2em]">TW</option>
            <option value="VN" className="bg-emerald-800/50 backdrop-blur-sm tracking-[0.2em]">VN</option>
            <option value="ME" className="bg-emerald-900/50 backdrop-blur-sm tracking-[0.2em]">ME</option>
        </select>
    );
}