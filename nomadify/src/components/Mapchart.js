import React, { memo } from "react";
import {
  Graticule,
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";


const MapChart = ({ setTooltipCountry, setTooltipCapital, handleClick }) => {
  return (
    <>
      <ComposableMap projectionConfig={{ scale: 130 }} >
          <Graticule stroke="#F13E51" />
          <ZoomableGroup>
            <Geographies geography="/features.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    data-tooltip-id="my-tooltip"      
                    data-tooltip-offset={0}
                    data-tooltip-float={true}
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseOver={() => {       
                      setTooltipCountry(`${geo.properties.name}`);
                      setTooltipCapital(`${geo.properties.capital}`);
                    }}
                    onClick={handleClick}
                    onMouseLeave={() => {
                      setTooltipCountry("");
                      setTooltipCapital("");
                    }}
                    style={{
                      default: {
                        fill: "#D6D6DA",
                        outline: "none"
                      },
                      hover: {
                        fill: "#E08C9C",
                        outline: "none"
                      },
                      pressed: {
                        fill: "#F13E51",
                        outline: "none"
                      }
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(MapChart);
