import React, {useContext, useEffect, useState, useRef} from 'react'
import axios from 'axios'
import {Context} from '../context/Context'
//css
import '../estilos/busquedasesion.css'

const BusquedaSesion = () => {
const {dispatch, listaProductos, buscarProducto} = useContext(Context)

	//Obtener productos de la BD
	const [lista, setLista] = useState([])
	useEffect(()=>{
		// Muestra todos los productos de la BD
		const obtener = async () =>{
			const res = await axios.get(`http://localhost:4000/api/productos/stock?buscar=${buscarProducto}`)
			setLista(res.data)
		}
		obtener()
	}, [buscarProducto])

	//funcion Agregar producto al carrito
	const agregarCarrito = id => {
		dispatch({
			type: 'SUM_CAR',
			sumCar: id
		})
	}

	// func sacar producto del carrito
	const sacarDeCarrito = id => {
		dispatch({
			type: 'SACAR_CAR',
			idObj: id
		})
	}

	//Abre vista modal
	const [vistaModal, setVistaModal] = useState(false)
	const [producto, setProducto] = useState(null)
	const modal = (productoObt) => {
		setVistaModal(true)
		setProducto(productoObt)
	}
	//Cierra vista modal
	const productoRef = useRef()
	useEffect(()=>{
		const ventana = e => {
			if(productoRef.current && !productoRef.current.contains(e.target)){
				setVistaModal(false)
			}
		}
		const esc = e => {
			if(e.key === 'Escape'){
				setVistaModal(false)	
			}			
		}
		document.addEventListener('mousedown', ventana)
		document.addEventListener('keydown', esc)

		return () => {
			document.removeEventListener('mousedown', ventana)
			document.removeEventListener('keydown', esc)			
		}
	})

	return (
		<div className='BusqUsuario'>
			<div className='busq-u'>
				{vistaModal &&
					<div className='vm-inicio-u'>
						<div className='cont' ref={productoRef}>
							<div className='producto'>
								<div className='cabecera'>
									<p className='titulo'>{producto.nombre}</p>
									<div className='btn-cerrar' onClick={() => setVistaModal(false)}>x</div>									
								</div>
								<div className='descripcion'>
									<p>{producto.descripcion}</p>
								</div>
								<div className='pie'>	
									<p className='precio'>${producto.precio}</p>
									<div className='categoria-cont'><p className='categoria'>{producto.categoria}</p></div>
									{producto.cantidad !== 0 ? 
										<p className='cantidad'>Disponibles: {producto.cantidad}</p>
										:
										<p className='cantidad'><i>Producto no disponible</i></p>
									}
								</div>
								{producto.cantidad > 0 && <div className='agregar-cont'>
								<div className='btn-agregar'
									onClick={() => agregarCarrito(producto._id)}
								>
									<p>AGREGAR</p>
								</div>
								{listaProductos.map((it, index) => (
									it === producto._id &&
										<div className='bnt-sacaAgrega' key={index} 
											onClick={() => sacarDeCarrito(producto._id)}>
											<p>x</p>
										</div>
								))}
								</div>
								}
							</div>
						</div>
					</div>
				}
				<div className='busqueda-cont'>
					{lista.length === 0 && <p>No se encontraron resultados</p>}				
					{lista.length !== 0 && <>
						{lista.length > 1 ? 
							<p>Se encontraron {lista.length} resultados...</p>
							:
							<p>Se encontró {lista.length} resultado...</p>
						}
						{lista.map((item,index) => (
							<div className='tarjeta-producto-busq-u' 
								key={index}
								>
								<div className='tarjeta-cont'>
									<div className='titulo'
										onClick={() => modal(item)}
									>							
										<h3>{item.nombre}</h3>
									</div>
									<div className='desc'
										onClick={() => modal(item)}
									>
										<p>{item.descripcion}</p>								
									</div>
									<div className='pie'>
										<div className='precio'>
											${item.precio}
										</div>
										<div className='categoria'>
											<p>{item.categoria}</p>
										</div>
										<div className='cantidad'>
											{item.cantidad > 0 ? 
												<p>Disponibles: {item.cantidad}</p>
												:
												<p>Producto no disponible</p>
											}
										</div>
									</div>
									{item.cantidad > 0 && <div className='agregar-cont'>
										<div className='btn-agregar'
											onClick={() => agregarCarrito(item._id)}
										>
											<p>AGREGAR</p>
										</div>
										{listaProductos.map((it, index) => (
											it === item._id &&
												<div className='bnt-sacaAgrega' key={index} 
													onClick={() => sacarDeCarrito(item._id)}>
													<p>x</p>
												</div>
										))}
										</div>
									}
								</div>
							</div>
						))}	
					</>}
				</div>
			</div>
		</div>	
	)
}

export default BusquedaSesion