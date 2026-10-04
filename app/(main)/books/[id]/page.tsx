import BookDetails from "@/components/modules/books/BookDetails";
import { getBooksDetailsById } from "@/lib/api/books";
import { getUserAllComments } from "@/lib/api/users";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBooksDetailsById(id);

  if (!book || !book.title) {
    return {
      title: "Book Archive Details | Librello",
      description: "Archival volume details and member lending options on Librello.",
    };
  }

  const coverUrl = book.cover || book.coverImage || "";

  return {
    title: `${book.title} | Librello Archive`,
    description: book.description || "Archival volume details and member lending options on Librello.",
    keywords: [
      book.title,
      book.author,
      book.category,
      "Books",
      "Curated Archive",
      "Physical Edition",
      "Librello",
    ].filter(Boolean),
    openGraph: {
      title: `${book.title} | Librello Archive`,
      description: book.description || "",
      images: coverUrl
        ? [
            {
              url: coverUrl,
              width: 1200,
              height: 630,
              alt: book.title,
            },
          ]
        : [],
    },
  };
}

const BooksDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const books = await getBooksDetailsById(id);

  let userComments: any[] = [];
  try {
    const commentsRes = await getUserAllComments(id);
    if (Array.isArray(commentsRes)) {
      userComments = commentsRes;
    } else if (Array.isArray(commentsRes?.data)) {
      userComments = commentsRes.data;
    } else if (Array.isArray(commentsRes?.comments)) {
      userComments = commentsRes.comments;
    }
  } catch {
    userComments = [];
  }

  return (
    <div className="w-11/12 mx-auto min-h-screen py-10 md:py-16">
      <BookDetails books={books} userComments={userComments} />
    </div>
  );
};

export default BooksDetailsPage;
