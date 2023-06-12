import React, { useEffect, useState, useRef } from "react";



const MultiSelect = ({ value, readonly }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v2/all");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // Set pre-selected values
    if (value && Array.isArray(value) && value.length > 0) {
      setSelectedCountries(value);
    }
  }, [value]);

  useEffect(() => {
    // Add event listener to close the dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleRemoveCountry = (country) => {
    if (readonly) {
      return; // Do nothing if in read-only mode
    }

    const updatedSelectedCountries = selectedCountries.filter(
      (selectedCountry) => selectedCountry !== country
    );

    setSelectedCountries(updatedSelectedCountries);
  };

  const handleCheckboxChange = (event) => {
    if (readonly) {
      return; // Do nothing if in read-only mode
    }

    const { value, checked } = event.target;
    let newSelectedCountries;

    if (value === "All") {
      // If 'All' is selected, set the selected countries to all countries
      if (checked) {
        newSelectedCountries = countries.map((country) => country.name);
        
      } else {
        newSelectedCountries = [];
      }
    } else {
      // For individual countries, update the selection accordingly
      if (checked) {
        newSelectedCountries = [...selectedCountries, value];
      } else {
        newSelectedCountries = selectedCountries.filter(
          (country) => country !== value
        );
      }
    }

    setSelectedCountries(newSelectedCountries);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
   
    <div className="country-dropdown" ref={dropdownRef}>
      <div className={`selected-values ${isOpen ? "open" : ""}`}
        onClick={toggleDropdown}>
        {selectedCountries.length > 0 ? (
          selectedCountries.map((country) => (
           
            <div key={country} className="selected-country">
              <span className="selected-country-text">{country}</span>
              {!readonly && (
                <span
                  className="selected-country-cross"
                  onClick={() => handleRemoveCountry(country)}>
                  <h3>×</h3>
                </span>
              )}
            </div>
          ))
        ) : (
          <span className="placeholder">e.g Australia</span>
        )}
      </div>
      {isOpen && (
        <div className="dropdown">    
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search countries"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              value="All"
              checked={selectedCountries.length === filteredCountries.length}
              onChange={handleCheckboxChange}
              disabled={readonly}
            />
            All
          </label>
          {filteredCountries.map((country) => (
            <label key={country.alpha2Code} className="checkbox-label">
              <input
                type="checkbox"
                value={country.name}
                checked={selectedCountries.includes(country.name)}
                onChange={handleCheckboxChange}
                disabled={readonly}
              />
              {country.name}
             
            </label>
          ))}
        </div>
      )}
    </div>

  );
};

export default MultiSelect;
