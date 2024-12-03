import React from "react";
import { Grid, Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const LWI = ({ data }) => {
    // Filtrar las PCs, Monitores, Proyector y Pantalla de los datos
    const pcs = data.filter(item => item.icon === "fa-computer");
    const monitors = data.filter(item => item.icon === "fa-display");
    const proyector = data.find(item => item.icon === "fa-video");
    
    // eslint-disable-next-line
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
                        <h5 style={{ margin: 0 }}>Datos de PC</h5>
                        <p style={{ margin: 0 }}>PC Marca: {pair.pc.marca}</p>
                        <p style={{ margin: 0 }}>PC Modelo: {pair.pc.modelo}</p>
                        <p style={{ margin: 0 }}>PC Número de Serie: {pair.pc.numero_de_serie}</p>
                        <p style={{ margin: 0 }}>
                        PC Status: {pair.pc.status ? "Activo" : "Inactivo"}
                        </p>
                        <p style={{ margin: 0 }}>
                        Transferido: {pair.pc.location_transfer ? "Si" : "No"}
                        </p>
                        <br></br>
                        <h5 style={{ margin: 0 }}>Datos de Monitor</h5>
                        <p style={{ margin: 0 }}>Monitor Marca: {pair.monitor.marca}</p>
                        <p style={{ margin: 0 }}>Monitor Modelo: {pair.monitor.modelo}</p>
                        <p style={{ margin: 0 }}>Monitor Número de Serie: {pair.monitor.numero_de_serie}</p>
                        <p style={{ margin: 0 }}>Monitor Status: {pair.monitor.status ? "Activo" : "Inactivo"}</p>
                        <p style={{ margin: 0 }}>
                        Transferido: {pair.pc.location_transfer ? "Si" : "No"}
                        </p>
                    </div>
                ) : "Información no disponible"
            }
            arrow
        >
            <Box
    sx={{
        textAlign: "center",
        // ml: "10px",
        // mr: "25px",
        transform: "rotate(0deg)", // Rotar todo el contenedor
    }}
>
    <img
        src={
            pair.pc && pair.monitor
                ? (pair.pc.location_transfer != null || pair.monitor.location_transfer != null)
                    ? "/assets/lwi_gris.png"
                    : (pair.pc.status && pair.monitor.status)
                        ? "/assets/lwi_verde.png"
                        : "/assets/lwi_rojo.png"
                : "/assets/lwi_rojo.png"
        }
        alt="Residencia"
        style={{
            width: "150px",
            height: "auto",
        }}
    />
</Box>
        {/* <Box sx={{ textAlign: "center", ml: "10px", mr: "25px" }}>
            <img
                src={
                    pair.pc && pair.monitor
                        ? (pair.pc.location_transfer != null || pair.monitor.location_transfer != null)
                            ? "/assets/DISENOSRESIDENCIA(2).png"
                            : (pair.pc.status && pair.monitor.status)
                                ? "/assets/DISENOSRESIDENCIA(1).png"
                                : "/assets/DISENOSRESIDENCIA.png"
                        : "/assets/DISENOSRESIDENCIA.png"
                }
                alt="Residencia"
                style={{ width: "200px", height: "auto",
                }}
            />
        </Box> */}

        </Tooltip>
    );

    const proyectorItem = (proyector, key) => (
        <Tooltip
            title={
                proyector ? (
                    <div key={key} >
                        <h5 style={{ margin: 0 }}>Datos de Proyector</h5>
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
                style={{ width: "100px", height: "auto", }}
            />
        </Box>
        </Tooltip>
    );
    const pantallaItem = (pantalla, key) => (
        <Tooltip
            title={
                pantalla ? (
                    <div key={key} >
                        <h5 style={{ margin: 0 }}>Datos de Pantalla</h5>
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
                style={{ width: "150px", height: "auto", }}
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

    return (
        <Box sx={{ maxHeight: 'calc(120vh - 150px)', overflowY: 'auto', width: '100%', overflowX: 'auto', justifyContent:"center"}}>
        <Box sx={{display:"flex", flexDirection: 'column' ,height: "100vh", backgroundColor: "transparent", width:"100%", minWidth:"100vh" }}>
          <Box sx={{display:"flex", width:"100%", height:"80%" }}>
                <Grid container  sx={{ height: "100%", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    {/* Fila 1 */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        {pairedItems.slice(0, 7).map((pair, index) =>
                            renderPairedItem(pair, `pair-row1-${index}`)
                        )}
                    </Grid>
                        
                    {/* Fila 2 */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        {pairedItems.slice(7, 14).map((pair, index) =>
                            renderPairedItem(pair, `pair-row2-${index}`)
                        )}
                    </Grid>

                    {/* Fila 5 (proyector centrado) */}
                    <Grid container item xs={12} >
                        <Grid item xs={2} /> {/* Espacio vacío */}
                        <Grid item xs={8}>
                        {proyector && proyectorItem(proyector, "proyector")}
                        </Grid>
                        <Grid item xs={2} /> {/* Espacio vacío */}
                    </Grid>

                    {/* Fila 3 */}
                    <Grid container item xs={12} sx={{ justifyContent:"right" }}>
                        {pairedItems.slice(14, 21).map((pair, index) =>
                            renderPairedItem(pair, `pair-row3-${index}`)
                        )}
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{display:"flex", width:"100%", justifyContent:"center", height:"20%", justifyItems:'space-betwen' }}>
                <Box sx={{ textAlign: "center"}}>
                
                {pantalla && pantallaItem(pantalla, "pantalla")}
                </Box>
                <Box sx={{mb:"250px"}}>
                {regulador && reguladorItem(regulador, "regulador")}
                </Box >
            </Box>
            </Box>
        </Box>
    );
};

export default LWI;
