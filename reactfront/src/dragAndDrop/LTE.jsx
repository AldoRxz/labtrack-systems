import React from "react";
import { Grid, Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const LTE = ({ data }) => {
    // Filtrar las PCs, Monitores, Proyector y Pantalla de los datos
    const pcs = data.filter(item => item.icon === "fa-computer");
    const monitors = data.filter(item => item.icon === "fa-display");
    const proyector = data.find(item => item.icon === "fa-video");
    const pantalla = data.find(item => item.icon === "fa-chalkboard-user");
    const regulador = data.find(item => item.icon === "fa-bolt" );

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
        <Box sx={{ textAlign: "center", ml:"10px", mr:"50px" }}>
            <img
                src={pair.pc && pair.monitor && pair.pc.status && pair.monitor.status ? "/assets/DISENOSRESIDENCIA(1).png" : "/assets/DISENOSRESIDENCIA.png"}
                alt="Residencia"
                style={{ width: "200px", height: "auto",
                    transform: "scaleX(-1)", // Voltear horizontalmente
                 }}
            />
        </Box>
        </Tooltip>
    );

    const proyectorItem = (proyector, key) => (
        <Tooltip
            title={
                proyector ? (
                    <div key={key} >
                        <h5 style={{ margin: 0 }}>Lugar</h5>
                        <p style={{ margin: 0 }}>Proyector Marca: {proyector.marca}</p>
                        <p style={{ margin: 0 }}>Proyector Modelo: {proyector.modelo}</p>
                        <p style={{ margin: 0 }}>Proyector Número de Serie: {proyector.numero_de_serie}</p>
                        <p style={{ margin: 0 }}>Proyector Status: {proyector.status ? "Activo" : "Inactivo"}</p>
                    </div>
                ) : "Información no disponible"
            }
            arrow
        >
        <Box sx={{ textAlign: "center"}}>
            <img
                src={proyector && proyector.status ? "/assets/proyector.png" : "/assets/proyector.png"}
                alt="Residencia"
                style={{ width: "100px", height: "auto", 
                    transform: "scaleX(-1)", // Voltear horizontalmente
                }}
            />
        </Box>
        </Tooltip>
    );

    const reguladorItem = (regulador, key) => (
        <Tooltip
            title={
                regulador ? (
                    <div key={key} >
                        <h5 style={{ margin: 0 }}>Datos de Regulador</h5>
                        <p style={{ margin: 0 }}>Regulador Marca: {regulador.marca}</p>
                        <p style={{ margin: 0 }}>Regulador Modelo: {regulador.modelo}</p>
                        <p style={{ margin: 0 }}>Regulador Número de Serie: {regulador.numero_de_serie}</p>
                        <p style={{ margin: 0 }}>Regulador Status: {regulador.status ? "Activo" : "Inactivo"}</p>
                    </div>
                ) : "Información no disponible"
            }
            arrow
        >
        <Box sx={{ textAlign: "center"}}>
            <img
                src={regulador && regulador.status ? "/assets/regulador.png" : "/assets/regulador.png"}
                alt="Residencia"
                style={{ width: "90px", height: "auto", }}
            />
        </Box>
        </Tooltip>
    );
    const pantallaItem = (pantalla, key) => (
        <Tooltip
            title={
                pantalla ? (
                    <div key={key} >
                        <h5 style={{ margin: 0 }}>Lugar</h5>
                        <p style={{ margin: 0 }}>Pantalla Marca: {pantalla.marca}</p>
                        <p style={{ margin: 0 }}>Pantalla Modelo: {pantalla.modelo}</p>
                        <p style={{ margin: 0 }}>Pantalla Número de Serie: {pantalla.numero_de_serie}</p>
                        <p style={{ margin: 0 }}>Pantalla Status: {pantalla.status ? "Activo" : "Inactivo"}</p>
                    </div>
                ) : "Información no disponible"
            }
            arrow
        >
        <Box sx={{ textAlign: "center"}}>
            <img
                src={pantalla && pantalla.status ? "/assets/pizarron.png" : "/assets/pizarron.png"}
                alt="Residencia"
                style={{ width: "150px", height: "auto", 
                    transform: "scaleX(-1)", // Voltear horizontalmente
                }}
            />
        </Box>
        </Tooltip>
    );

    return (
        <Box sx={{ maxHeight: 'calc(120vh - 150px)', overflowY: 'auto', width: '100%', overflowX: 'auto', justifyContent:"center"}}>
        <Box sx={{display:"flex", height: "100%", backgroundColor: "transparent", width:"100%", justifyContent:"center", minWidth:"100vh" }}>
            <Box sx={{display:"flex", width:"30%", justifyContent:"center", alignItems:"center" }}>
            <Box sx={{ textAlign: "center"}}>
                <Box sx={{mb:"250px"}}>
                {regulador && reguladorItem(regulador, "regulador")}
                </Box >
                {pantalla && pantallaItem(pantalla, "pantalla")}
                </Box>
            </Box>
          <Box sx={{display:"flex", width:"100%"}}>
                <Grid container  sx={{ height: "100%", justifyContent: "center", alignItems: "center", width: "100%",pt:'40px'  }}>
                    {/* Fila 1 */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        {pairedItems.slice(0, 3).map((pair, index) =>
                            renderPairedItem(pair, `pair-row1-${index}`)
                        )}
                    </Grid>

                    {/* Fila 2 */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        {pairedItems.slice(3, 6).map((pair, index) =>
                            renderPairedItem(pair, `pair-row2-${index}`)
                        )}
                    </Grid>

                    {/* Fila 3 */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        {pairedItems.slice(6, 9).map((pair, index) =>
                            renderPairedItem(pair, `pair-row3-${index}`)
                        )}
                    </Grid>

                    {/* Fila 4 */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        {pairedItems.slice(9, 12).map((pair, index) =>
                            renderPairedItem(pair, `pair-row4-${index}`)
                        )}
                    </Grid>

                    {/* Fila 5 (proyector centrado) */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        <Grid item xs={2} /> {/* Espacio vacío */}
                        <Grid item xs={8}>
                        {proyector && proyectorItem(proyector, "proyector")}
                        </Grid>
                        <Grid item xs={2} /> {/* Espacio vacío */}
                    </Grid>

                    {/* Fila 6 */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        {pairedItems.slice(12, 15).map((pair, index) =>
                            renderPairedItem(pair, `pair-row6-${index}`)
                        )}
                    </Grid>

                    {/* Fila 7 */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        {pairedItems.slice(15, 18).map((pair, index) =>
                            renderPairedItem(pair, `pair-row7-${index}`)
                        )}
                    </Grid>

                    {/* Fila 8 */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        {pairedItems.slice(18, 21).map((pair, index) =>
                            renderPairedItem(pair, `pair-row8-${index}`)
                        )}
                    </Grid>

                    {/* Fila 9 */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        {pairedItems.slice(21, 24).map((pair, index) =>
                            renderPairedItem(pair, `pair-row9-${index}`)
                        )}
                    </Grid>
                </Grid>
            </Box>
            
            </Box>
        </Box>
    );
};

export default LTE;
