import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormularioViagem from "./components/FormularioViagem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota do formulário do motorista */}
        <Route path="/form/:id" element={<FormularioViagem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
