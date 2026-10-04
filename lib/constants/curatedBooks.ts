export interface BookItem {
  _id: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  description: string;
  cover: string;
  coverImage: string;
  fee: number;
  status: "Published" | "Checked Out";
  librarianName: string;
  librarianEmail: string;
  librarianImage: string;
  stock: number;
  requests: number;
  rating: number;
  reviewsCount?: number;
  publisher?: string;
  year?: number;
  isbn?: string;
  pages?: number;
  createdAt: string;
}

export const CURATED_ARCHIVAL_BOOKS: BookItem[] = [
  {
    _id: "book-lib-01",
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Literature",
    description:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things'd be if you had made other choices.",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    fee: 4.5,
    status: "Published",
    librarianName: "Curator Evelyn Vance",
    librarianEmail: "curator@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    stock: 5,
    requests: 28,
    rating: 4.9,
    reviewsCount: 142,
    publisher: "Canongate Books",
    year: 2020,
    isbn: "978-0525559474",
    pages: 304,
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    _id: "book-lib-02",
    title: "Meditations: Annotated Imperial Edition",
    author: "Marcus Aurelius",
    category: "Philosophy",
    description:
      "Written in Greek by the only Roman emperor who was also a philosopher, without any intention of publication, the Meditations of Marcus Aurelius offer a remarkable series of challenging spiritual reflections and exercises developed as the emperor struggled to understand himself and make sense of the universe.",
    cover:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    fee: 3.5,
    status: "Published",
    librarianName: "Curator Evelyn Vance",
    librarianEmail: "curator@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    stock: 7,
    requests: 41,
    rating: 4.95,
    reviewsCount: 310,
    publisher: "Modern Library",
    year: 2002,
    isbn: "978-0812968255",
    pages: 256,
    createdAt: "2026-01-18T12:00:00.000Z",
  },
  {
    _id: "book-lib-03",
    title: "Ficciones",
    author: "Jorge Luis Borges",
    category: "Literature",
    description:
      "The seventeen pieces in Ficciones demonstrate the whirlwind of Borges's genius and confirm his status as the fountainhead of all Latin American modern fiction. Includes 'The Library of Babel', 'The Garden of Forking Paths', and 'Tlön, Uqbar, Orbis Tertius'.",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    fee: 4.0,
    status: "Published",
    librarianName: "Archivist Daniel Sterling",
    librarianEmail: "daniel@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    stock: 4,
    requests: 19,
    rating: 4.88,
    reviewsCount: 88,
    publisher: "Grove Press",
    year: 1962,
    isbn: "978-0802130303",
    pages: 174,
    createdAt: "2026-01-20T09:30:00.000Z",
  },
  {
    _id: "book-lib-04",
    title: "SPQR: A History of Ancient Rome",
    author: "Mary Beard",
    category: "History",
    description:
      "Covering 1,000 years of Roman history, SPQR maps how an unpromising iron-age village on the Tiber grew into an undisputed global superpower, examining not just emperors and senators, but ordinary people, enslaved populations, and conquered territories.",
    cover:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800",
    fee: 5.0,
    status: "Published",
    librarianName: "Archivist Daniel Sterling",
    librarianEmail: "daniel@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    stock: 3,
    requests: 22,
    rating: 4.79,
    reviewsCount: 165,
    publisher: "Liveright",
    year: 2015,
    isbn: "978-0871404237",
    pages: 608,
    createdAt: "2026-01-25T14:15:00.000Z",
  },
  {
    _id: "book-lib-05",
    title: "Cosmos",
    author: "Carl Sagan",
    category: "Science",
    description:
      "Cosmos is one of the bestselling science books of all time. In clear-eyed, lyrical prose, Sagan reveals a jewel-like blue world inhabited by a life form that is just beginning to discover its own identity and venture into the vast ocean of space.",
    cover:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800",
    fee: 4.5,
    status: "Published",
    librarianName: "Curator Evelyn Vance",
    librarianEmail: "curator@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    stock: 6,
    requests: 35,
    rating: 4.93,
    reviewsCount: 240,
    publisher: "Ballantine Books",
    year: 1980,
    isbn: "978-0345539434",
    pages: 384,
    createdAt: "2026-02-01T11:00:00.000Z",
  },
  {
    _id: "book-lib-06",
    title: "Letters to a Young Poet",
    author: "Rainer Maria Rilke",
    category: "Essays",
    description:
      "Written in letters to a young officer seeking counsel on writing and solitude, Rilke's insights on art, solitude, love, and life have inspired generations of readers, seekers, and creators worldwide.",
    cover:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    fee: 3.0,
    status: "Published",
    librarianName: "Curator Evelyn Vance",
    librarianEmail: "curator@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    stock: 8,
    requests: 15,
    rating: 4.86,
    reviewsCount: 95,
    publisher: "W. W. Norton & Company",
    year: 1929,
    isbn: "978-0393310398",
    pages: 144,
    createdAt: "2026-02-04T08:45:00.000Z",
  },
  {
    _id: "book-lib-07",
    title: "Beyond Good and Evil",
    author: "Friedrich Nietzsche",
    category: "Philosophy",
    description:
      "In Beyond Good and Evil, Nietzsche confronts past philosophers who blindly accepted dogmatic premises in their consideration of morality. He calls for a new breed of free spirits who transcend conventional binaries.",
    cover:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    fee: 4.0,
    status: "Published",
    librarianName: "Archivist Daniel Sterling",
    librarianEmail: "daniel@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    stock: 4,
    requests: 27,
    rating: 4.74,
    reviewsCount: 112,
    publisher: "Vintage",
    year: 1989,
    isbn: "978-0679724650",
    pages: 288,
    createdAt: "2026-02-08T16:20:00.000Z",
  },
  {
    _id: "book-lib-08",
    title: "Invisible Cities",
    author: "Italo Calvino",
    category: "Literature",
    description:
      "Marco Polo conjures up cities of magical times for his host, the Chinese ruler Kublai Khan, but it gradually appears that every city he describes is none other than Venice, refracted through the prism of poetic imagination.",
    cover:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=800",
    fee: 4.2,
    status: "Published",
    librarianName: "Curator Evelyn Vance",
    librarianEmail: "curator@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    stock: 5,
    requests: 33,
    rating: 4.91,
    reviewsCount: 178,
    publisher: "Harcourt Brace Jovanovich",
    year: 1974,
    isbn: "978-0156453806",
    pages: 165,
    createdAt: "2026-02-10T10:00:00.000Z",
  },
  {
    _id: "book-lib-09",
    title: "Gödel, Escher, Bach: An Eternal Golden Braid",
    author: "Douglas R. Hofstadter",
    category: "Science",
    description:
      "A metaphorical exploration of how cognition, intelligence, and conscious experience emerge from hidden neurological mechanisms, woven through mathematics, the graphic art of M.C. Escher, and the music of J.S. Bach.",
    cover:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800",
    fee: 6.0,
    status: "Published",
    librarianName: "Archivist Daniel Sterling",
    librarianEmail: "daniel@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    stock: 2,
    requests: 40,
    rating: 4.89,
    reviewsCount: 205,
    publisher: "Basic Books",
    year: 1979,
    isbn: "978-0465026562",
    pages: 777,
    createdAt: "2026-02-12T13:40:00.000Z",
  },
  {
    _id: "book-lib-10",
    title: "The Myth of Sisyphus and Other Essays",
    author: "Albert Camus",
    category: "Philosophy",
    description:
      "In one of the most influential works of existentialist thought, Camus introduces his philosophy of the absurd: man's futile search for meaning in an indifferent universe, concluding that 'one must imagine Sisyphus happy.'",
    cover:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800",
    fee: 3.8,
    status: "Published",
    librarianName: "Curator Evelyn Vance",
    librarianEmail: "curator@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    stock: 6,
    requests: 29,
    rating: 4.84,
    reviewsCount: 160,
    publisher: "Vintage",
    year: 1955,
    isbn: "978-0679733737",
    pages: 212,
    createdAt: "2026-02-14T09:10:00.000Z",
  },
  {
    _id: "book-lib-11",
    title: "Guns, Germs, and Steel: The Fates of Human Societies",
    author: "Jared Diamond",
    category: "History",
    description:
      "A groundbreaking work arguing that geographical and environmental factors shaped the modern world, explaining why Eurasian civilizations survived and conquered others, refuting racist theories of human history.",
    cover:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    fee: 5.0,
    status: "Published",
    librarianName: "Archivist Daniel Sterling",
    librarianEmail: "daniel@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    stock: 3,
    requests: 18,
    rating: 4.72,
    reviewsCount: 130,
    publisher: "W. W. Norton & Company",
    year: 1997,
    isbn: "978-0393317558",
    pages: 480,
    createdAt: "2026-02-15T15:30:00.000Z",
  },
  {
    _id: "book-lib-12",
    title: "Leonardo da Vinci",
    author: "Walter Isaacson",
    category: "Biography",
    description:
      "Based on thousands of pages from Leonardo's astonishing notebooks and new discoveries about his life and work, Isaacson weaves a narrative that connects his art to his science, showing how genius is rooted in curious observation.",
    cover:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800",
    coverImage:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800",
    fee: 5.5,
    status: "Published",
    librarianName: "Curator Evelyn Vance",
    librarianEmail: "curator@librello.org",
    librarianImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    stock: 6,
    requests: 48,
    rating: 4.82,
    reviewsCount: 290,
    publisher: "Farrar, Straus and Giroux",
    year: 2011,
    isbn: "978-0374533557",
    pages: 499,
    createdAt: "2026-02-18T11:20:00.000Z",
  },
];
