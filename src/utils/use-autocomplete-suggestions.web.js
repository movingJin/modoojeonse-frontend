import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from "@vis.gl/react-google-maps";

/**
 * A reusable hook that retrieves autocomplete suggestions from the Google Places API.
 * The data is loaded from the new Autocomplete Data API.
 *
 * @param inputString The input string for which to fetch autocomplete suggestions.
 * @param requestOptions Additional options for the autocomplete request.
 *
 * @returns An object containing the autocomplete suggestions, loading status, and a reset function.
 */
export function useAutocompleteSuggestions(inputString, requestOptions = {}) {
  const placesLib = useMapsLibrary('places');

  const sessionTokenRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!placesLib) return;

    const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;

    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    const request = {
      ...requestOptions,
      input: inputString,
      sessionToken: sessionTokenRef.current,
    };

    if (inputString === '') {
      if (suggestions.length > 0) setSuggestions([]);
      return;
    }

    setIsLoading(true);
    AutocompleteSuggestion.fetchAutocompleteSuggestions(request).then((res) => {
      setSuggestions(res.suggestions);
      setIsLoading(false);
    });
  }, [placesLib, inputString]);

  return {
    suggestions,
    isLoading,
    resetSession: () => {
      sessionTokenRef.current = null;
      setSuggestions([]);
    },
  };
}
