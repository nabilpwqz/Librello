import { NextRequest, NextResponse } from "next/server";
import { CURATED_ARCHIVAL_BOOKS } from "@/lib/constants/curatedBooks";

interface ChatMessage {
  sender: string;
  text: string;
}

const LITERARY_QUOTES = [
  `"I have always imagined that Paradise will be a kind of a library." — Jorge Luis Borges`,
  `"A book is a device to ignite the imagination." — Alan Bennett`,
  `"Reading is an act of civilization; it's one of the greatest acts of civilization because it takes the free raw material of the mind and builds castles of possibility." — Ben Okri`,
  `"You can never get a cup of tea large enough or a book long enough to suit me." — C.S. Lewis`,
  `"Books are a uniquely portable magic." — Stephen King`,
  `"In the library of our lives, every turned page is a deliberate step into another universe." — Archival Maxim`,
];

const GENRE_RECOMMENDATIONS: Record<
  string,
  { title: string; author: string; blurb: string; link: string }[]
> = {
  philosophy: [
    {
      title: "Meditations: Annotated Imperial Edition",
      author: "Marcus Aurelius",
      blurb: "Timeless Stoic spiritual reflections on self-discipline, mortality, and tranquility.",
      link: "/books/book-lib-02",
    },
    {
      title: "Beyond Good and Evil",
      author: "Friedrich Nietzsche",
      blurb: "A radical dissection of conventional morality and the will to power in human psychology.",
      link: "/books/book-lib-07",
    },
    {
      title: "The Myth of Sisyphus",
      author: "Albert Camus",
      blurb: "A lucid philosophical essay on the absurd, resilience, and finding profound freedom in existence.",
      link: "/books?search=Camus",
    },
    {
      title: "Letters from a Stoic",
      author: "Seneca",
      blurb: "Practical moral epistles offering ancient wisdom on friendship, simplicity, and inner peace.",
      link: "/books?category=Philosophy",
    },
  ],
  fiction: [
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      blurb: "A poignant exploration of parallel lives, unmade choices, and rediscovering wonder in living.",
      link: "/books/book-lib-01",
    },
    {
      title: "The Shadow of the Wind",
      author: "Carlos Ruiz Zafón",
      blurb: "A gothic love letter to literature set in post-war Barcelona's Cemetery of Forgotten Books.",
      link: "/books/book-lib-03",
    },
    {
      title: "Invisible Cities",
      author: "Italo Calvino",
      blurb: "Poetic dialogues between Marco Polo and Kublai Khan sketching fifty-five fantastical cities.",
      link: "/books/book-lib-09",
    },
    {
      title: "Norwegian Wood",
      author: "Haruki Murakami",
      blurb: "A nostalgic, bittersweet voyage into youth, loss, and musical memory.",
      link: "/books?category=Literature",
    },
  ],
  science: [
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      blurb: "An interstellar mystery of survival, ingenious physics, and cross-species solidarity.",
      link: "/books/book-lib-05",
    },
    {
      title: "Cosmos: The Planetary Journey",
      author: "Carl Sagan",
      blurb: "A luminous tapestry tracing cosmic evolution, astronomical wonders, and human consciousness.",
      link: "/books/book-lib-10",
    },
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      blurb: "Accessible inquiry into black holes, the big bang, and the fabric of spacetime.",
      link: "/books?category=Science",
    },
  ],
  history: [
    {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      blurb: "Provocative examination of how shared myths allowed Homo sapiens to dominate planet Earth.",
      link: "/books/book-lib-04",
    },
    {
      title: "The Silk Roads: A New History of the World",
      author: "Peter Frankopan",
      blurb: "A sweeping re-centering of global civilization along the ancient trade arteries of Asia.",
      link: "/books/book-lib-08",
    },
    {
      title: "Guns, Germs, and Steel",
      author: "Jared Diamond",
      blurb: "Geographical and environmental foundations shaping the divergence of human societies.",
      link: "/books?category=History",
    },
  ],
  essays: [
    {
      title: "Atomic Habits",
      author: "James Clear",
      blurb: "Scientific systems for incremental behavioral improvements with compound returns.",
      link: "/books/book-lib-06",
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      blurb: "Masterwork on the dual cognitive architectures driving human intuition and deliberation.",
      link: "/books/book-lib-12",
    },
    {
      title: "Leonardo da Vinci: Archival Codex",
      author: "Walter Isaacson",
      blurb: "Magnificent biographical synthesis of insatiable curiosity, art, anatomy, and engineering.",
      link: "/books/book-lib-11",
    },
  ],
};

function getRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => 0.5 - Math.random());
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] }: { message: string; history?: ChatMessage[] } =
      await req.json();

    const text = (message || "").toLowerCase().trim();
    const randomQuote = getRandom(LITERARY_QUOTES);

    let reply = "";
    let detectedTheme = "Curatorial Guidance";

    // 1. Delivery & Circulation Logistics
    if (
      text.includes("delivery") ||
      text.includes("ship") ||
      text.includes("courier") ||
      text.includes("circulation") ||
      text.includes("loan period") ||
      text.includes("how does it work")
    ) {
      detectedTheme = "Circulation & Logistics";
      reply = `### Librello White-Glove Physical Circulation\n\n` +
        `Our library operates as a living physical archive, delivering hand-curated hardcover volumes directly to your door.\n\n` +
        `- **Standard Courier Dispatch:** Books are insured, packed in protective archival mailers, and delivered in **2–3 business days**.\n` +
        `- **Reading Duration:** Default lending term is **14 days**. You can request a 1-click 14-day renewal directly from your [Dashboard](/dashboard/user/userDeliveryHistory) at no additional charge.\n` +
        `- **Simple Doorstep Returns:** When you finish reading, tap "Request Courier Pickup" in your account, and our logistics partner collects the parcel from your doorstep.\n` +
        `- **Circulation Fees:** Nominal fees ($3.50 – $5.50) support archival preservation, insured transit, and protective book care.\n\n` +
        `*Would you like to explore available editions in our [Archival Catalog](/books)?*`;
    }
    // 2. Specific Philosophy Inquiry
    else if (
      text.includes("philosophy") ||
      text.includes("stoic") ||
      text.includes("marcus") ||
      text.includes("nietzsche") ||
      text.includes("ethics") ||
      text.includes("wisdom")
    ) {
      detectedTheme = "Philosophy & Stoic Treatises";
      const picks = shuffle(GENRE_RECOMMENDATIONS.philosophy).slice(0, 3);
      reply = `### Curated Philosophical Inquiries\n\n` +
        `Delighted you seek the contemplative path. In our private archive, we preserve seminal philosophical treatises renowned for clarity, resilience, and depth:\n\n` +
        picks
          .map(
            (p) =>
              `- **[${p.title}](${p.link})** by *${p.author}*\n  ${p.blurb}`
          )
          .join("\n\n") +
        `\n\n*Curatorial Thought:*\n> ${randomQuote}\n\n` +
        `All volumes are available for insured physical delivery. You can also view all titles in [Philosophy Collections](/books?category=Philosophy).`;
    }
    // 3. Science & Speculative Inquiries
    else if (
      text.includes("science") ||
      text.includes("sci-fi") ||
      text.includes("space") ||
      text.includes("physics") ||
      text.includes("cosmos") ||
      text.includes("astronomy")
    ) {
      detectedTheme = "Science & Speculative Volumes";
      const picks = shuffle(GENRE_RECOMMENDATIONS.science).slice(0, 2);
      reply = `### Cosmic Exploration & Scientific Inquiry\n\n` +
        `For inquisitive minds drawn to the boundaries of the known universe, here are highlighted archival selections:\n\n` +
        picks
          .map(
            (p) =>
              `- **[${p.title}](${p.link})** by *${p.author}*\n  ${p.blurb}`
          )
          .join("\n\n") +
        `\n\n- **Bonus Classic Recommendation:** Frank Herbert's *Dune* (Archival clothbound edition available upon member reservation).\n\n` +
        `*Browse our full [Science Section](/books?category=Science) to request courier delivery.*`;
    }
    // 4. History & Ancient Civilizations
    else if (
      text.includes("history") ||
      text.includes("historical") ||
      text.includes("civilization") ||
      text.includes("ancient") ||
      text.includes("war") ||
      text.includes("empire")
    ) {
      detectedTheme = "Historical Chronologies";
      const picks = shuffle(GENRE_RECOMMENDATIONS.history).slice(0, 2);
      reply = `### Preserved Chronicles & World History\n\n` +
        `History in physical literature provides an irreplaceable gravitas. Here are celebrated archival works:\n\n` +
        picks
          .map(
            (p) =>
              `- **[${p.title}](${p.link})** by *${p.author}*\n  ${p.blurb}`
          )
          .join("\n\n") +
        `\n\n> "To study history is to converse across centuries with minds that shaped our present."\n\n` +
        `Explore all chronicles in the [History Archive](/books?category=History).`;
    }
    // 5. Personal Growth, Habits & Essays
    else if (
      text.includes("habit") ||
      text.includes("productivity") ||
      text.includes("growth") ||
      text.includes("discipline") ||
      text.includes("essay") ||
      text.includes("thinking")
    ) {
      detectedTheme = "Essays & Intellectual Mastery";
      const picks = shuffle(GENRE_RECOMMENDATIONS.essays).slice(0, 2);
      reply = `### Frameworks for Mind & Habit Formation\n\n` +
        `If you are designing personal reading systems or seeking clarity in daily life, these volumes are reader favorites:\n\n` +
        picks
          .map(
            (p) =>
              `- **[${p.title}](${p.link})** by *${p.author}*\n  ${p.blurb}`
          )
          .join("\n\n") +
        `\n\n*Pro Tip for Archival Readers:* Pairing *Atomic Habits* with a physical reading journal elevates retention significantly.`;
    }
    // 6. Broad Recommendations / Discovery
    else if (
      text.includes("recommend") ||
      text.includes("suggest") ||
      text.includes("what should i read") ||
      text.includes("best book") ||
      text.includes("favorite") ||
      text.includes("new book")
    ) {
      detectedTheme = "Eclectic Curatorial Selections";
      // Pick 3 from different genres randomly
      const gKeys = Object.keys(GENRE_RECOMMENDATIONS);
      const chosenGenres = shuffle(gKeys).slice(0, 3);
      const picks = chosenGenres.map((g) => getRandom(GENRE_RECOMMENDATIONS[g]));

      reply = `### Tailored Curatorial Recommendations\n\n` +
        `Based on our current living circulation, here is a diverse selection of exceptional physical editions:\n\n` +
        picks
          .map(
            (p, idx) =>
              `${idx + 1}. **[${p.title}](${p.link})** by *${p.author}*\n   ${p.blurb}`
          )
          .join("\n\n") +
        `\n\n> ${randomQuote}\n\n` +
        `*Looking for a specific genre or mood? Tell me how you're feeling (e.g. "late night thriller", "meditative calm", or "intense biography"), and I'll tailor exact editions for you.*`;
    }
    // 7. General Inquiry or Conversational Greeting
    else {
      detectedTheme = "Librello Concierge Advisor";
      const sample = getRandom(CURATED_ARCHIVAL_BOOKS);

      reply = `### Greetings from the Librello Concierge\n\n` +
        `I am your dedicated literary advisor, trained on the catalog, circulation policies, and curated editions of the Librello reading sanctuary.\n\n` +
        `Here is a spotlight volume currently available for doorstep loan:\n` +
        `- **[${sample.title}](/books/${sample._id})** by *${sample.author}* (${sample.category})\n  *${sample.description.slice(0, 140)}...*\n\n` +
        `**How may I assist you today?**\n` +
        `- Inquire about specific genres (Philosophy, Literature, History, Science)\n` +
        `- Ask about book condition, lending durations, and courier returns\n` +
        `- Describe a theme or reading vibe for custom recommendations\n\n` +
        `> ${randomQuote}`;
    }

    return NextResponse.json({
      success: true,
      reply,
      provider: `Librello Advisor (${detectedTheme})`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to process concierge inquiry",
      },
      { status: 500 }
    );
  }
}
