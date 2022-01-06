import React, { useState, useEffect } from "react";
import axios from "axios";
import './style.css'
import Header from "./header/header";

const Peserta = () => {
  const [pesertaLomba, setPesertaLomba] = useState([])
  const [inputName, setInputName] = useState('')
  const [curretnId, setCurrentId] = useState(null)

  // FUNGSI BUTTON HANDLE EDIT
  const handleEdit = (event) => {
    let idPeserta = event.target.value
    axios.get(`http://backendexample.sanbercloud.com/api/contestants/${idPeserta}`)
      .then(res => {
        let data = res.data
        setInputName(data.name)
        setCurrentId(data.id)
      })
  }

  // FUNGSI BUTTON HANDLE DELETE
  const handleDelete = (event) => {
    let idPeserta = parseInt(event.target.value)
    axios.delete(`http://backendexample.sanbercloud.com/api/contestants/${idPeserta}`)
      .then(() => {
        let newPesertaLomba = pesertaLomba.filter(el => {
          return el.id !== idPeserta
        })
        setPesertaLomba(newPesertaLomba)
      })
  }

  // FUNGSI handleChange
  const handleChange = (event) => {
    let inputValue = event.target.value
    setInputName(inputValue)
  }

  // FUNGSI handleSubmit
  const handleSubmit = (event) => {
    event.preventDefault()

    if (curretnId === null) {
      // Untuk create data baru
      axios.post(`http://backendexample.sanbercloud.com/api/contestants`, { name: inputName })
        .then(res => {
          let data = res.data
          setPesertaLomba([...pesertaLomba, { id: data.id, name: data.name }])
        })
    } else {
      axios.put(`http://backendexample.sanbercloud.com/api/contestants/${curretnId}`, { name: inputName })
        .then(() => {
          let singlePeserta = pesertaLomba.find(el => el.id === curretnId)
          singlePeserta.name = inputName
          setPesertaLomba([...pesertaLomba])
        })
    }
    setInputName('')
    setCurrentId(null)
  }


  useEffect(() => {
    const fetcData = async () => {
      const result = await axios.get(`http://backendexample.sanbercloud.com/api/contestants`)

      setPesertaLomba(result.data.map(x => {
        return { id: x.id, name: x.name }
      }))
    }
    fetcData()
  }, [])

  return (
    <>
      <Header />
      {
        pesertaLomba !== null &&
        (
          <div style={{ width: '70%', margin: '0 auto', textAlign: 'center' }}>
            <table className="peserta-lomba">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Peserta</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {
                  pesertaLomba.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          <button onClick={handleEdit} value={item.id}>Edit</button>
                          &nbsp;
                          <button onClick={handleDelete} value={item.id}>Delete</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            <h1>Form Input Peserta</h1>
            <form className="inputan" onSubmit={handleSubmit}>
              <label>Masukan Nama Anda</label>&nbsp;
              <input type='text' value={inputName} onChange={handleChange}></input>&nbsp;
              <button>Submit</button>
            </form>
          </div>
        )
      }
    </>
  )
}

export default Peserta