import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Cropper from 'react-easy-crop'
import './styles.css'

const App = () => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(0.4)
  const [croppedArea, setCroppedArea] = useState(null)
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels)
  }
  const img =
    'https://t24373204.p.clickup-attachments.com/t24373204/08c6e4cd-90bf-4c78-b6e6-63831080b408/nordstadjugend-logo.png'
  const [preview, setPreview] = useState(img)
  useEffect(() => {
    const ff = async () => {
      try {
        const croppedImageUrl = await getCroppedImg(img, croppedArea)
        console.log({ croppedImageUrl })
        setPreview(croppedImageUrl)
      } catch (e) {
        console.log('err')
        console.log(e)
      }
    }
    ff()
  }, [croppedArea])
  const getCroppedImg = async (imageSrc, crop) => {
    console.log(crop)
    const m = new Promise((resolve, reject) => {
      const img = new Image()
      img.src = imageSrc
      img.onload = () => resolve(img)
      img.onerror = reject
    })
    const image = await m

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    document.getElementById('cn').innerHTML = ''
    document.getElementById('cn').appendChild(canvas)
    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }

    canvas.width = crop.width
    canvas.height = crop.height

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          resolve(url)
        } else {
          reject(new Error('Canvas is empty'))
        }
      }, 'image/jpeg')
    })
  }
  return (
    <>
      <div className="App">
        <div className="crop-container">
          <Cropper
            image={img}
            crop={crop}
            zoom={zoom}
            aspect={4 / 4}
            onCropChange={(d) => {
              // this code will helps
              if (zoom < 1) {
                return setCrop({ x: 0, y: 0 })
              }
              setCrop(d)
            }}
            // this code may helps
            minZoom={0.1}
            onCropComplete={onCropComplete}
            onZoomChange={(z) => {
              console.log('xzzzz')
              setZoom(z)
            }}
          />
        </div>
        <div className="controls">
          {/* this code may helps */}
          <input
            type="range"
            value={zoom}
            min={0.1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              const v = e.target.value

              setZoom(v)
            }}
            className="zoom-range"
          />
        </div>
      </div>
      <img src={preview} style={{ height: 100, width: 'auto', zIndex: '-1' }} />
      <div id="cn"></div>
    </>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
