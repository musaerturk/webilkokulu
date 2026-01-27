
import React, { useState, useEffect, useCallback } from 'react';
import { Book } from '../types';
import * as api from '../services/firebaseService';
import BookFormModal from '../components/BookFormModal';
import { PlusIcon, EditIcon, TrashIcon } from '../components/icons';

const Library: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedBooks = await api.getBooks();
      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Kitaplar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleAddBook = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm("Bu kitabı silmek istediğinizden emin misiniz?")) {
      try {
        await api.deleteBook(bookId);
        setBooks(prevBooks => prevBooks.filter(b => b.id !== bookId));
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Kitap silinirken bir hata oluştu.");
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchBooks();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Eklenen Kitaplar</h2>
        <button
          onClick={handleAddBook}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <PlusIcon /> <span className="ml-2">Yeni Kitap Ekle</span>
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Kitaplar yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">Henüz kitap eklenmemiş.</p>
          ) : (
            books.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <img src={book.coverImageUrl || 'https://picsum.photos/400/300'} alt={book.title} className="w-full h-48 object-cover"/>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-800">{book.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{book.genre}</p>
                   <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 last:mr-0 mr-1 mb-2">
                    {book.level}
                  </span>
                  <p className="text-sm text-gray-600 flex-grow">{book.subject}</p>
                   <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                     <button onClick={() => handleEditBook(book)} className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-gray-100"><EditIcon/></button>
                     <button onClick={() => handleDeleteBook(book.id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-gray-100"><TrashIcon/></button>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <BookFormModal
          book={editingBook}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Library;
