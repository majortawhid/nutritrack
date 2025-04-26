import React from 'react';
import PropTypes from 'prop-types';
import './NutrientInfo.css'; // Optional: Add styles for this component

const NutrientInfo = ({ nutrient, value, unit }) => {
          return (
                    <div className="nutrient-info">
                              <span className="nutrient-name">{nutrient}:</span>
                              <span className="nutrient-value">
                                        {value} {unit}
                              </span>
                    </div>
          );
};

NutrientInfo.propTypes = {
          nutrient: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
          unit: PropTypes.string.isRequired,
};

export default NutrientInfo;