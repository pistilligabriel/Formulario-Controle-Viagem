import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  IconButton,
} from "@mui/material";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

export default function FormularioViagem() {
  const { id } = useParams();
  const [viagem, setViagem] = useState(null);

  const [kmInicial, setKmInicial] = useState("");
  const [odometroInicio, setOdometroInicio] = useState([]);
  const [odometroInicioPreview, setOdometroInicioPreview] = useState([]);
  const [horarioSaida, setHorarioSaida] = useState("");
  const [kmFinal, setKmFinal] = useState("");
  const [odometroFinal, setOdometroFinal] = useState([]);
  const [odometroFinalPreview, setOdometroFinalPreview] = useState([]);
  const [horarioChegada, setHorarioChegada] = useState("");
  const [avarias, setAvarias] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    axios
      .get(`https://88qt8k34gc.execute-api.sa-east-1.amazonaws.com/prod/viagem/${id}`)
      .then((res) => setViagem(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleFileChange = (e, setState, setPreview) => {
    const files = Array.from(e.target.files).slice(0, 5); // limite de 5 fotos
    setState(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const removePreview = (index, setState, setPreview) => {
    setState((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("kmInicial", kmInicial);
      formData.append("horarioSaida", horarioSaida);
      formData.append("kmFinal", kmFinal);
      formData.append("horarioChegada", horarioChegada);
      formData.append("avarias", avarias);
      formData.append("observacoes", observacoes);

      odometroInicio.forEach((file) => formData.append("odometroInicio", file));
      odometroFinal.forEach((file) => formData.append("odometroFinal", file));

      await axios.post(
        `https://88qt8k34gc.execute-api.sa-east-1.amazonaws.com/prod/viagem/${id}/checklist`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Checklist enviado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar checklist.");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Card style={{boxShadow:"0 4px 30px black"}}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Checklist da Viagem
          </Typography>

          {viagem ? (
            <>
              <Typography variant="h6">
                Motorista: {viagem.motorista.nome}
              </Typography>
              <Typography variant="h6">
                Veículo: {viagem.veiculo.modelo} - {viagem.veiculo.placa}
              </Typography>
              <Typography variant="h6">Destino: {viagem.destino}</Typography>
              <Typography variant="h6">
                Data: {viagem.dataViagem}
              </Typography>

              <Typography variant="h5" style={{textDecoration: 'underline', marginTop: '20px'}}>
                Dados de Saída
              </Typography>
              {/* Km Inicial */}
              <Box mt={2}>
                <TextField
                  label="Km Inicial"
                  type="number"
                  fullWidth
                  value={kmInicial}
                  onChange={(e) => setKmInicial(e.target.value)}
                />
              </Box>

              {/* Odômetro Inicial */}
              <Box mt={5}>
                <Typography variant="subtitle1">Odômetro Inicial (fotos)</Typography>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    handleFileChange(e, setOdometroInicio, setOdometroInicioPreview)
                  }
                />
                <Box display="flex" mt={4} gap={1} flexWrap="wrap">
                  {odometroInicioPreview.map((src, i) => (
                    <Box key={i} position="relative">
                      <img
                        src={src}
                        alt={`preview-${i}`}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                      />
                      <IconButton
                        size="small"
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          backgroundColor: "white",
                        }}
                        onClick={() =>
                          removePreview(i, setOdometroInicio, setOdometroInicioPreview)
                        }
                      >
                        <FaTrash size={14} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Horário Saída */}
              <Box mt={2}>
                <TextField
                  label="Horário de Saída"
                  type="time"
                  fullWidth
                  value={horarioSaida}
                  onChange={(e) => setHorarioSaida(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Typography variant="h5" style={{textDecoration: 'underline', marginTop: '20px'}}>
                Dados de Chegada
              </Typography>

              {/* Km Final */}
              <Box mt={2}>
                <TextField
                  label="Km Final"
                  type="number"
                  fullWidth
                  value={kmFinal}
                  onChange={(e) => setKmFinal(e.target.value)}
                />
              </Box>

              {/* Odômetro Final */}
              <Box mt={5}>
                <Typography variant="subtitle1">Odômetro Final (fotos)</Typography>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    handleFileChange(e, setOdometroFinal, setOdometroFinalPreview)
                  }
                />
                <Box display="flex" mt={4} gap={1} flexWrap="wrap">
                  {odometroFinalPreview.map((src, i) => (
                    <Box key={i} position="relative">
                      <img
                        src={src}
                        alt={`preview-final-${i}`}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                      />
                      <IconButton
                        size="small"
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          backgroundColor: "white",
                        }}
                        onClick={() =>
                          removePreview(i, setOdometroFinal, setOdometroFinalPreview)
                        }
                      >
                        <FaTrash size={14} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Horário Chegada */}
              <Box mt={2}>
                <TextField
                  label="Horário de Chegada"
                  type="time"
                  fullWidth
                  value={horarioChegada}
                  onChange={(e) => setHorarioChegada(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {/* Avarias */}
              <Box mt={2}>
                <TextField
                  label="Avarias"
                  fullWidth
                  multiline
                  rows={2}
                  value={avarias}
                  onChange={(e) => setAvarias(e.target.value)}
                />
              </Box>

              {/* Observações */}
              <Box mt={2}>
                <TextField
                  label="Observações"
                  fullWidth
                  multiline
                  rows={2}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </Box>

              {/* Botão Enviar */}
              <Box mt={5}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                >
                  Enviar Checklist
                </Button>
              </Box>
            </>
          ) : (
            <Typography>Carregando viagem...</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
