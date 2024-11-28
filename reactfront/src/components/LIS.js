import React from "react";
import "./LIS.css";

const LIS = () => {
  return (
    <div className="room-container">
      {/* Columna izquierda */}
      <div className="left-1">
        <img src="/assets/computer.png" alt="Computer 1" className="computer" />
        <img src="/assets/chair.png" alt="Chair 1" className="chair" />
      </div>
      <div className="left-2">
        <img src="/assets/computer.png" alt="Computer 2" className="computer" />
        <img src="/assets/chair.png" alt="Chair 2" className="chair" />
      </div>
      <div className="left-3">
        <img src="/assets/computer.png" alt="Computer 3" className="computer" />
        <img src="/assets/chair.png" alt="Chair 3" className="chair" />
      </div>
      <div className="left-4">
        <img src="/assets/computer.png" alt="Computer 4" className="computer" />
        <img src="/assets/chair.png" alt="Chair 4" className="chair" />
      </div>

      {/* Columna derecha */}
      <div className="right-1">
        <img src="/assets/computer.png" alt="Computer 5" className="computer" />
        <img src="/assets/chair.png" alt="Chair 5" className="chair" />
      </div>
      <div className="right-2">
        <img src="/assets/computer.png" alt="Computer 6" className="computer" />
        <img src="/assets/chair.png" alt="Chair 6" className="chair" />
      </div>
      <div className="right-3">
        <img src="/assets/computer.png" alt="Computer 7" className="computer" />
        <img src="/assets/chair.png" alt="Chair 7" className="chair" />
      </div>
      <div className="right-4">
        <img src="/assets/computer.png" alt="Computer 8" className="computer" />
        <img src="/assets/chair.png" alt="Chair 8" className="chair" />
      </div>

      {/* Proyector */}
      <div className="proyector">
        <img src="/assets/proyector.png" alt="Proyector" className="proyector-img" />
      </div>

      {/* Pizarra */}
      <div className="board">
        <img src="/assets/pizarron.png" alt="Pizarra" className="pizarron" />
      </div>

      {/* Regulador */}
      <div className="regulator">
        <img src="/assets/regulador.png" alt="Regulador" className="regulador-img" />
      </div>
    </div>
  );
};

export default LIS;
