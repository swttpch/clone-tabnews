import { useEffect, useState } from "react";
function Home() {
    const [page, setPage] = useState(1)
    const [showContentP2, setShowContentP2] = useState(false)
    const [isPage2Dirty, setIsPage2Dirty] = useState(false)
    const [hasReturnedToPage1, setHasReturnedToPage1] = useState(false)
    useEffect(() => {
        if(page === 2) {
            setIsPage2Dirty(true)
        }
        if(isPage2Dirty && page === 1) {
            setHasReturnedToPage1(true)
        }
    }, [page])
    return <div 
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100vh',
            gap: '2rem',
            padding: '2rem'
        }}
    >
        <div style={{
            display: page === 1 ? 'block':'none',
          

        }}><h1>{isPage2Dirty ? 'voltou porque? 🤨' :'Oi mel 🍯'}</h1></div>
         <div style={{
            display: page === 2? 'flex':'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem'
        }}><h1>Só queria dizer que:</h1>
        {
            showContentP2 ? <h2 style={{textAlign: 'center'}}>Você é muito linda e interessante e inteligente {hasReturnedToPage1 && '🤨'}</h2> : <button onClick={() => setShowContentP2(true)}>Aperte aqui pra descobrir</button>
        }
        </div>
         <div style={{
            display: page === 3 ? 'block':'none'
        }}><h1 style={{
            textAlign: 'center'
        }}>E eu estou adorando falar contigo 🌹</h1></div>
        <div style={{
            display: 'flex',gap: '1rem', justifyContent: 'center', alignItems: 'center'
        }}>

        <button
            className="secondary"
            style={{
                display: page === 1 || (page === 2 && !showContentP2)  ? 'none' : 'block',
                
            }}
        onClick={() => setPage(e => e - 1)}>Página anterior</button>
        <button 
        className="primary"
         style={{
            display: page === 3 || (page === 2 && !showContentP2) ? 'none' : 'block',
        }}
        onClick={() => setPage(e => e + 1)}>Próxima página</button>
        </div>
        <div
         style={{
            display: page !== 3 ? 'none' : 'block',
            padding: '3rem',
            fontSize: '24px'
        }}
        >
            <a href="https://wa.me/5511989717953?text=Também%20estou%20adorando%20falar%20contigo%20iguinhoinho!!">
                
            <button >Responder 😉</button>
                </a>
        </div>
        </div>
}

export default Home;