let bhajans = [];
async function loadBhajans() {
    try {
        const module = await import("./bhajan.js");
        bhajans = module.bhajans;
        renderCards(bhajans);
    } catch (error) {
        console.error("Error loading bhajan file:", error);
    }
}

function renderCards(data) {
    const homePage = document.getElementById("homePage");
    if (!homePage) return;
    homePage.innerHTML = "";
    if (data.length === 0) {
        homePage.innerHTML = `<p class="col-span-full text-center text-stone-500 py-12">No bhajans found matching your search.</p>`;
        return;
    }

    data.forEach((bhajan) => {
        const card = document.createElement("div");
        card.className =
            "group relative bg-white/75 border border-stone-200/60 rounded-2xl p-6 md:p-8 flex flex-col justify-between cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(13,148,136,0.12)] hover:bg-white hover:border-teal-600/30 transform hover:-translate-y-1.5 transition-all duration-300 overflow-hidden";
        card.onclick = () => openBhajan(bhajan.id);
        card.innerHTML = `
            <div class="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div>
                <h3 class="text-xl font-bold text-stone-900 group-hover:text-purple-800 mb-2 transition-colors tracking-wide">
                    ${bhajan.title}
                </h3>
                ${bhajan.tarj
                    ? `<span class="inline-block bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-md mb-3 font-medium">
                            तर्ज: ${bhajan.tarj}
                       </span>`
                    : ""
                }

                <p class="text-stone-400 text-sm whitespace-pre-line leading-relaxed font-light">
                    ${bhajan.snippet}...
                </p>
            </div>

            <div class="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-teal-800 group-hover:text-blue-700 transition-colors">
                <span>Read Full Lyrics</span>
                <span class="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
        `;
        homePage.appendChild(card);
    });
}

function searchBhajans() {
    const query = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = bhajans.filter(
        (b) =>
            b.title.toLowerCase().includes(query) ||
            b.snippet.toLowerCase().includes(query) ||
            (b.tarj && b.tarj.toLowerCase().includes(query))
    );

    renderCards(filtered);
}

function openBhajan(id) {
    const bhajan = bhajans.find((b) => String(b.id) === String(id));
    if (!bhajan) return;
    document.getElementById("homePage").classList.add("hidden");
    document.getElementById("detailPage").classList.remove("hidden");
    const paragraphs = bhajan.hindi.split(/\n\s*\n/);
    const highlightedLyricsHTML = paragraphs
        .map((para, index) => {
            const textColorClass =
                index % 2 === 0
                    ? "text-red-600"
                    : "text-blue-600";

            const lines = para
                .split("\n")
                .map(
                    (line) =>
                        `<div class="">${line}</div>`
                )
                .join("");

            return `
                <div class="${textColorClass} mb-6">
                    ${lines}
                </div>
            `;
        })
        .join("");

    const relatedBhajans = bhajans.filter(
        (b) =>
            b.tarj === bhajan.tarj &&
            b.id !== bhajan.id
    );

    let relatedSectionHTML = "";

    if (bhajan.tarj && relatedBhajans.length > 0) {
        relatedSectionHTML = `
            <div class="mt-12 pt-8 border-t border-stone-200">
                <h4 class="text-lg font-bold text-stone-900 mb-4 tracking-wide">
                    इसी तर्ज पर अन्य भजन
                </h4>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${relatedBhajans
                        .map(
                            (rb) => `
                                <div
                                    onclick="openBhajan('${rb.id}')"
                                    class="p-4 bg-stone-50 border border-stone-200 rounded-xl hover:bg-teal-50/50 hover:border-teal-600/30 transition-all cursor-pointer"
                                >
                                    <h5 class="font-semibold text-stone-800 text-sm mb-1">
                                        ${rb.title}
                                    </h5>

                                    <p class="text-xs text-stone-500 line-clamp-1">
                                        ${rb.snippet}
                                    </p>
                                </div>
                            `
                        )
                        .join("")}
                </div>
            </div>
        `;
    }

    document.getElementById("bhajanFullContent").innerHTML = `
        <h2 class="text-3xl md:text-4xl font-bold text-stone-900 mb-4 text-center tracking-wide">
            ${bhajan.title}
        </h2>
        ${bhajan.tarj
            ? `
            <div class="text-center mb-8">
                <span class="inline-block bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-sm font-semibold border border-amber-200">
                    तर्ज: ${bhajan.tarj}
                </span>
            </div>
        `
            : ""
        }
        <div class="text-center px-2 border-b border-stone-100 pb-4">
            <div class=" text-lg md:text-xl tracking-wide font-medium">
                ${highlightedLyricsHTML}
            </div>
        </div>
        ${relatedSectionHTML}
    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

function showHomePage() {
    document
        .getElementById("detailPage")
        .classList.add("hidden");
    document
        .getElementById("homePage")
        .classList.remove("hidden");
}
window.openBhajan = openBhajan;
window.showHomePage = showHomePage;
window.searchBhajans = searchBhajans;
loadBhajans();