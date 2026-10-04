import LibrarianAddBook from "@/components/modules/dashboard/librarian/AddBook";

export const metadata = {
  title: "Catalog New Edition | Curator Dashboard | Librello",
  description:
    "Add new volumes to the Librello archive, manage book details, and expand your collection from the curator dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const LibrarianAddBookPage = () => {
  return (
    <div className="min-h-screen">
      <LibrarianAddBook />
    </div>
  );
};

export default LibrarianAddBookPage;
