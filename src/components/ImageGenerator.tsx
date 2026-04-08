import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const PROMPT_SUGGESTIONS = [
  "A noble warhorse in golden armor at sunset",
  "White destrier rearing with knight in shining mail",
  "Black stallion crossing a medieval bridge at dawn",
  "Palomino horse in a jousting tournament",
  "Draft horse pulling a merchant's cart through village",
  "Arabian horse in Crusader camp with banners",
];

export function ImageGenerator() {
  const generateImage = useAction(api.ai.generateImage);
  const saveImage = useMutation(api.images.save);

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setSaved(false);

    const fullPrompt = `Medieval illuminated manuscript style artwork: ${prompt.trim()}. Rendered in the style of a 12th century bestiary illustration with gold leaf details, intricate border decorations, rich colors on aged parchment. The horse should be depicted with medieval artistic conventions.`;

    try {
      const result = await generateImage({ prompt: fullPrompt });
      if (result) {
        setGeneratedImage(result);
      } else {
        setError("The mystical arts failed. Please try a different incantation.");
      }
    } catch (err) {
      setError("An error occurred while conjuring your steed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedImage || saved) return;

    setIsSaving(true);
    try {
      await saveImage({ prompt, imageBase64: generatedImage });
      setSaved(true);
    } catch (err) {
      setError("Could not save to gallery. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Generator Section */}
      <div className="bg-gradient-to-b from-amber-950/20 to-amber-950/10 border border-amber-900/30 rounded-xl p-4 md:p-8 backdrop-blur-sm mb-6 md:mb-8">
        <h2 className="font-medieval text-xl md:text-2xl text-amber-200 mb-4 md:mb-6 text-center">
          Summon Your Steed
        </h2>

        <div className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-xs text-amber-600/80 tracking-wider mb-2 uppercase">
              Describe Your Vision
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A magnificent warhorse adorned in royal caparisons..."
              rows={3}
              className="w-full px-4 py-3 bg-amber-950/30 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-700/50 focus:outline-none focus:border-amber-600/60 focus:ring-1 focus:ring-amber-600/30 transition-all resize-none text-sm md:text-base"
            />
          </div>

          {/* Suggestions */}
          <div>
            <p className="text-xs text-amber-700/60 mb-2 md:mb-3 tracking-wider">INSPIRATIONS:</p>
            <div className="flex flex-wrap gap-2">
              {PROMPT_SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs bg-amber-950/40 border border-amber-900/30 rounded-full text-amber-500/80 hover:text-amber-300 hover:border-amber-700/50 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 md:py-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 text-amber-100 font-medium tracking-wider rounded-lg hover:from-amber-700 hover:via-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30 text-sm md:text-base"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2 md:gap-3">
                <span className="w-4 md:w-5 h-4 md:h-5 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin" />
                CONJURING YOUR STEED...
              </span>
            ) : (
              "FORGE THE IMAGE"
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 md:mb-8 p-4 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400/90 text-center text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="bg-gradient-to-b from-amber-950/20 to-amber-950/10 border border-amber-900/30 rounded-xl p-8 md:p-16 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <div className="relative">
              <div className="w-24 md:w-32 h-24 md:h-32 border-4 border-amber-800/30 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-24 md:w-32 h-24 md:h-32 border-4 border-transparent border-t-amber-500 rounded-full animate-spin" />
              <div className="absolute inset-4 md:inset-6 flex items-center justify-center text-4xl md:text-5xl">
                🐴
              </div>
            </div>
            <div className="text-center">
              <p className="text-amber-200 font-medieval tracking-wide mb-2 text-sm md:text-base">The alchemists are at work...</p>
              <p className="text-amber-700/60 text-xs md:text-sm">This may take a moment</p>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generated Image */}
      {generatedImage && !isGenerating && (
        <div className="bg-gradient-to-b from-amber-950/20 to-amber-950/10 border border-amber-900/30 rounded-xl p-3 md:p-6 backdrop-blur-sm animate-fadeIn">
          <div className="relative group">
            {/* Decorative frame */}
            <div className="absolute -inset-1 md:-inset-2 border-2 border-amber-700/30 rounded-lg pointer-events-none" />
            <div className="absolute -inset-2 md:-inset-4 border border-amber-800/20 rounded-lg pointer-events-none" />

            <img
              src={`data:image/png;base64,${generatedImage}`}
              alt={prompt}
              className="w-full rounded-lg shadow-2xl shadow-amber-900/30"
            />

            {/* Overlay gradient for medieval effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-amber-900/10 rounded-lg pointer-events-none" />
          </div>

          <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-amber-600/60 tracking-wider uppercase mb-1">PROMPT:</p>
              <p className="text-amber-300/80 text-sm truncate">{prompt}</p>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving || saved}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium tracking-wide transition-all text-sm flex-shrink-0 ${
                saved
                  ? "bg-green-900/30 text-green-400 border border-green-800/40"
                  : "bg-amber-800/50 text-amber-200 border border-amber-700/40 hover:bg-amber-700/50"
              }`}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin" />
                  SAVING...
                </span>
              ) : saved ? (
                "SAVED TO GALLERY"
              ) : (
                "SAVE TO GALLERY"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
