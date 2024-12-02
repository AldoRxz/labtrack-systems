import React from "react";
import { Grid, Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const DragAndDropLayout = ({ data }) => {
    // Filtrar las PCs, Monitores, Proyector y Pantalla de los datos
    const pcs = data.filter(item => item.icon === "fa-computer");
    const monitors = data.filter(item => item.icon === "fa-display");
    const proyector = data.find(item => item.icon === "fa-proyector");
    const pantalla = data.find(item => item.icon === "fa-chalkboard-user");

    // Combinar PC y Monitor por lugar (asumiendo un campo común `lugar`)
    const pairedItems = pcs.map(pc => {
        const monitorIndex = monitors.findIndex(m => m.lugar === pc.lugar);
        const monitor = monitorIndex !== -1 ? monitors.splice(monitorIndex, 1)[0] : null;
        return { pc, monitor };
    });

    // Función para renderizar un par (PC y Monitor)
    const renderPairedItem = (pair, key) => (
        <Tooltip
            title={
                pair.pc && pair.monitor ? (
                    <div>
                        <h5 style={{ margin: 0 }}>Lugar</h5>
                        <p style={{ margin: 0 }}>PC Marca: {pair.pc.marca}</p>
                        <p style={{ margin: 0 }}>PC Modelo: {pair.pc.modelo}</p>
                        <p style={{ margin: 0 }}>PC Número de Serie: {pair.pc.numero_de_serie}</p>
                        <p style={{ margin: 0 }}>PC Status: {pair.pc.status ? "Activo" : "Inactivo"}</p>
                        <p style={{ margin: 0 }}>Monitor Marca: {pair.monitor.marca}</p>
                        <p style={{ margin: 0 }}>Monitor Modelo: {pair.monitor.modelo}</p>
                        <p style={{ margin: 0 }}>Monitor Número de Serie: {pair.monitor.numero_de_serie}</p>
                        <p style={{ margin: 0 }}>Monitor Status: {pair.monitor.status ? "Activo" : "Inactivo"}</p>
                    </div>
                ) : "Información no disponible"
            }
            arrow
        >
            {/* <Paper
                key={key}
                elevation={3}
                sx={{
                    height: "48px",
                    width: "68px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: pair.pc && pair.monitor && pair.pc.status && pair.monitor.status ? "green" : "red",
                    ml: "150px",
                    mt: "-16px", // Move the item 10 pixels up
                    mr: "117px", // Add margin-right
                    mb: "-5px", // Add margin-bottom    
                }}
            >
                {pair.pc && (
                    <Box sx={{ textAlign: "center", color: "black"}}>
                        <i
                            className={`fa-solid ${pair.pc.icon} fa-2x`}
                            style={{ color: "transparent" }}
                        ></i>
                    </Box>
                )}
                {pair.monitor && (
                    <Box sx={{ textAlign: "center", color: "black" }}>
                        <i
                            className={`fa-solid ${pair.monitor.icon} fa-2x`}
                            style={{ color: "transparent", marginTop: "8px" }}
                        ></i>
                    </Box>
                )}
            </Paper> */}
        <Box sx={{ textAlign: "center", ml:"10px", mr:"50px" }}>
            <img
                src={pair.pc && pair.monitor && pair.pc.status && pair.monitor.status ? "/assets/DISEÑOS RESIDENCIA(1).png" : "/assets/DISEÑOS RESIDENCIA.png"}
                alt="Residencia"
                style={{ width: "100%", height: "auto", }}
            />
        </Box>
        </Tooltip>
    );

    return (
        <Box sx={{ height: "100%", backgroundColor: "transparent", width:"100%" }}>
            <Box sx={{display:"flex", width:"80%"}}>
                <Grid container  sx={{ height: "100%", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    {/* Fila 1 */}
                    <Grid container item xs={12} sx={{ }}>
                        {pairedItems.slice(0, 3).map((pair, index) =>
                            renderPairedItem(pair, `pair-row1-${index}`)
                        )}
                    </Grid>

                    {/* Fila 2 */}
                    <Grid container item xs={12} sx={{mb:"px"}} >
                        {pairedItems.slice(3, 6).map((pair, index) =>
                            renderPairedItem(pair, `pair-row2-${index}`)
                        )}
                    </Grid>

                    {/* Fila 3 */}
                    <Grid container item xs={12} >
                        {pairedItems.slice(7, 9).map((pair, index) =>
                            renderPairedItem(pair, `pair-row3-${index}`)
                        )}
                    </Grid>

                    {/* Fila 4 */}
                    <Grid container item xs={12}>
                        {pairedItems.slice(10, 12).map((pair, index) =>
                            renderPairedItem(pair, `pair-row4-${index}`)
                        )}
                    </Grid>

                    {/* Fila 5 (proyector centrado) */}
                    <Grid container item xs={12} >
                        <Grid item xs={2} /> {/* Espacio vacío */}
                        <Grid item xs={8}>
                            {proyector && renderPairedItem({ pc: proyector }, "proyector")}
                        </Grid>
                        <Grid item xs={2} /> {/* Espacio vacío */}
                    </Grid>

                    {/* Fila 6 */}
                    <Grid container item xs={12} >
                        {pairedItems.slice(12, 15).map((pair, index) =>
                            renderPairedItem(pair, `pair-row6-${index}`)
                        )}
                    </Grid>

                    {/* Fila 7 */}
                    <Grid container item xs={12} >
                        {pairedItems.slice(16, 18).map((pair, index) =>
                            renderPairedItem(pair, `pair-row7-${index}`)
                        )}
                    </Grid>

                    {/* Fila 8 */}
                    <Grid container item xs={12} >
                        {pairedItems.slice(19, 21).map((pair, index) =>
                            renderPairedItem(pair, `pair-row8-${index}`)
                        )}
                    </Grid>

                    {/* Fila 9 */}
                    <Grid container item xs={12} >
                        {pairedItems.slice(22, 24).map((pair, index) =>
                            renderPairedItem(pair, `pair-row9-${index}`)
                        )}
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{display:"flex", width:"20%"}}>
                {/* <Box sx={{ textAlign: "center"}}>
                    <img
                        src={"/assets/pizarron.png"}
                        alt="Residencia"
                        style={{ width: "100%", height: "auto", }}
                    />
                </Box> */}
             </Box>   
        </Box>
    );
};

export default DragAndDropLayout;
