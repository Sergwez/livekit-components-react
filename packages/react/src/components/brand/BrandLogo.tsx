import * as React from 'react';

export class BrandLogo extends React.Component {
  state = {
    src: null,
  };

  // componentDidMount() {
  //   const endpoint = 'My_endpoint_here';
  //   fetch(endpoint)
  //     .then((response) => response.json())
  //     .then((data) => this.setState({ src: data.imageURL }))
  //     .catch((error) => console.error('Error:', error));
  // }
  
  render() {
    const { src } = this.state;
    const parsBrandingData: string | null = sessionStorage.getItem('brandingData')
    let logoUrl = 'https://proofix.ru/wp-content/themes/proofix/assets/img/tild3435-6664-4661-b038-376665396631__group_26_2.png'
    if(parsBrandingData){
      const parsBrandingDataObj =  JSON.parse(parsBrandingData)
      if(parsBrandingDataObj.logo) {
        logoUrl = parsBrandingDataObj.logo
      }
      
    }
    
    if (!src)
      return (
        <div className="lk-branding_style">
          <img
            src={logoUrl}
            style={{ width: '100%', height: 'auto' }}
            alt="From API"
          />
        </div>
      );

    return (
      <img
        src="https://img.freepik.com/premium-vector/abstract-colorful-bird_621127-276.jpg"
        alt="From API"
      />
    );
  }
}
