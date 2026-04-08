import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface ImageItem {
  _id: Id<"images">;
  _creationTime: number;
  userId: Id<"users">;
  prompt: string;
  imageBase64: string;
  createdAt: number;
}

export function Gallery() {
  const images = useQuery(api.images.list);
  const removeImage = useMutation(api.images.remove);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [deletingId, setDeletingId] = useState<Id<"images"> | null>(null);

  if (images === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24">
        <div className="w-12 h-12 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin mb-4" />
        <p className="text-amber-500/60 text-sm tracking-wider">LOADING YOUR COLLECTION...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-16 md:py-24">
        <div className="text-5xl md:text-6xl mb-4 md:mb-6 opacity-50">🖼️</div>
        <h3 className="font-medieval text-xl md:text-2xl text-amber-300/60 mb-3">Your Gallery Awaits</h3>
        <p className="text-amber-600/50 text-sm max-w-md mx-auto">
          Create your first medieval horse illustration and it shall appear here in your collection.
        </p>
      </div>
    );
  }

  const handleDelete = async (id: Id<"images">) => {
    setDeletingId(id);
    try {
      await removeImage({ id });
      if (selectedImage?._id === id) {
        setSelectedImage(null);
      }
    } catch (err) {
      console.error("Failed to delete image:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="text-center mb-6 md:mb-10">
        <h2 className="font-medieval text-xl md:text-2xl text-amber-200 mb-2">Your Royal Collection</h2>
        <p className="text-amber-600/60 text-xs md:text-sm tracking-wider">
          {images.length} ILLUMINATION{images.length !== 1 ? "S" : ""} IN YOUR GALLERY
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((image: ImageItem) => (
          <div
            key={image._id}
            className="group relative bg-gradient-to-b from-amber-950/20 to-amber-950/10 border border-amber-900/30 rounded-xl overflow-hidden cursor-pointer transition-all hover:border-amber-700/50 hover:shadow-xl hover:shadow-amber-900/20"
            onClick={() => setSelectedImage(image)}
          >
            {/* Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={`data:image/png;base64,${image.imageBase64}`}
                alt={image.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b0a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <p className="text-amber-200 text-sm line-clamp-2">{image.prompt}</p>
                <p className="text-amber-600/60 text-xs mt-1">{formatDate(image.createdAt)}</p>
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(image._id);
              }}
              disabled={deletingId === image._id}
              className="absolute top-2 right-2 w-8 h-8 bg-red-950/80 border border-red-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 hover:bg-red-900/80 hover:text-red-300"
            >
              {deletingId === image._id ? (
                <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-[#0d0b0a]/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-gradient-to-b from-amber-950/30 to-amber-950/20 border border-amber-900/40 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={`data:image/png;base64,${selectedImage.imageBase64}`}
                alt={selectedImage.prompt}
                className="w-full max-h-[60vh] md:max-h-[70vh] object-contain bg-[#0d0b0a]"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 md:top-4 md:right-4 w-10 h-10 bg-amber-950/80 border border-amber-800/50 rounded-lg flex items-center justify-center text-amber-400 hover:bg-amber-900/80 hover:text-amber-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 md:p-6 border-t border-amber-900/30">
              <p className="text-amber-200 text-sm md:text-base mb-2">{selectedImage.prompt}</p>
              <p className="text-amber-600/60 text-xs">Created on {formatDate(selectedImage.createdAt)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
