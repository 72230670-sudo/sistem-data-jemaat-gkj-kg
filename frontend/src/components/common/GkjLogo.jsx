import React from 'react'
import gkjLogo from '../../assets/logo_gkj.jpg'

// Official GKJ Logo provided by user (Gunungan + Merpati + Pita "Gereja Gereja Kristen Jawa")
export const GKJ_OFFICIAL_LOGO = gkjLogo

export default function GkjLogo({ size = 78, className = '', style = {} }) {
  return (
    <img
      src={gkjLogo}
      alt="Logo GKJ Kotagede"
      className={className}
      style={{
        width: size,
        height: 'auto',
        maxHeight: size * 1.15,
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
      onError={(e) => {
        if (e.currentTarget.src !== '/logo_gkj.jpg') {
          e.currentTarget.src = '/logo_gkj.jpg'
        }
      }}
    />
  )
}
