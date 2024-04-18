import * as React from 'react';

export class BrandLogo extends React.Component {
  
  render() {
    const parsBrandingData: string | null = sessionStorage.getItem('brandingData')
    let logoUrl = 'https://proofix.ru/wp-content/themes/proofix/assets/img/tild3435-6664-4661-b038-376665396631__group_26_2.png'
    if(parsBrandingData){
      const parsBrandingDataObj =  JSON.parse(parsBrandingData)
      if(parsBrandingDataObj.logo) {
        logoUrl = parsBrandingDataObj.logo
      }
      
    }
    
    return (
      <div className="lk-branding_style">
        <img
          src={logoUrl}
          style={{ width: '100%', height: 'auto' }}
          alt="From API"
        />
      </div>
    );
  }
}
