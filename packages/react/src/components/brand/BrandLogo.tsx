import * as React from 'react';

export class BrandLogo extends React.Component {
  state = {
    src: null,
  };

  componentDidMount() {
    const endpoint = 'My_endpoint_here';
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => this.setState({ src: data.imageURL }))
      .catch((error) => console.error('Error:', error));
  }

  render() {
    const { src } = this.state;

    if (!src)
      return (
        <div style={{ width: '150px', position: 'absolute', left: '10px' }}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhLn9mkdOEKpwHcxBHM-vJh_8eNIC7OYdl72__JLiMMg&s"
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
