import { useState, useEffect, useCallback } from 'react';

import { ImageGallery } from './ImageGallery/ImageGallery';
import Searchbar  from './Searchbar/Searchbar';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { getAllImages } from '../services/imagesApi';
import css from './App.module.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [hasMoreImages, setHasMoreImages] = useState(false);

  const getImages = useCallback(async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await getAllImages(page, query);
        setImages(prev => (prev ? [...prev, ...response.hits] : response.hits));
        setHasMoreImages(
          response.total <= 12 ? false : response.hits.length > 0
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }, [page, query])
  
  useEffect(() => {
      if (query.trim() !== '') {
      getImages();
    }
  }, [getImages, page, query]);

  const handleAddQuery = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const opeModal = largeImageURL => {
    setIsModalOpen(true);
    setSelectedImage(largeImageURL);
    document.addEventListener('keydown', handleKeyDown);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
    document.removeEventListener('keydown', handleKeyDown);
  };

  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className={css.Container}>
      <Searchbar onSubmit={handleAddQuery} />
      {error && <h1>{error}</h1>}
      {images.length > 0 && <ImageGallery images={images} onClick={opeModal} />}
      {hasMoreImages && <Button onClick={handleLoadMore} />}
      {isLoading && <Loader />}
      {isModalOpen && (
        <Modal selectedImage={selectedImage} onClick={handleOverlayClick} />
      )}
    </div>
  );
};

export default App;
