import React, { useState, useCallback, useMemo } from 'react';
import { useAutocompleteSuggestions } from '../utils/use-autocomplete-suggestions';
import Combobox from 'react-widgets/Combobox';

import 'react-widgets/styles.css';

export const CustomAutocomplete = ({ onPlaceSelect }) => {
  const [inputValue, setInputValue] = useState('');

  const { suggestions, resetSession, isLoading } =
    useAutocompleteSuggestions(inputValue);

  const handleInputChange = useCallback((value) => {
    if (typeof value === 'string') {
      setInputValue(value);
    }
  }, []);

  const handleSelect = useCallback((prediction) => {
    if (typeof prediction === 'string') return;

    const place = prediction.toPlace();
    place
      .fetchFields({
        fields: [
          'viewport',
          'location',
          'svgIconMaskURI',
          'iconBackgroundColor',
        ],
      })
      .then(() => {
        resetSession();
        onPlaceSelect(place);
        setInputValue('');
      });
  }, [onPlaceSelect]);

  const predictions = useMemo(() => {
    return suggestions
      .filter(suggestion => suggestion.placePrediction)
      .map(({ placePrediction }) => placePrediction);
  }, [suggestions]);

  return (
    <div className="autocomplete-container">
      <Combobox
        placeholder="주소, 장소 검색"
        data={predictions}
        dataKey="placeId"
        textField="text"
        value={inputValue}
        onChange={handleInputChange}
        onSelect={handleSelect}
        busy={isLoading}
        filter={() => true}
        focusFirstItem={true}
        hideEmptyPopup
        hideCaret
      />
    </div>
  );
};

export default CustomAutocomplete;
