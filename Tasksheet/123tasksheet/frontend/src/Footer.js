import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import linkedin from './linkedin.png';
import facebook from './facebook.png';
import twitter from './twitter.png';

function Footer() {
    const {t} = useTranslation();
    return (
      <footer className='Footer-container'>
         
          <div className='Footer_display'>
              <div className='col1'>
                  <h5>{t('About Us')}</h5>
                  <p >We are a dedicated team of professionals committed to delivering exceptional services in the fields of law, e-tuition, and books. With years of experience and a passion for helping others, we strive to meet the diverse needs of our clients and customers. Our mission is to provide reliable, accessible, and high-quality resources that empower individuals to achieve their goals and aspirations.</p>
              </div>
              
              <div className='Footer_col '>
                  <h5>{t('Contact Us')}</h5>
                  <p><strong>{t('Email:')}</strong> Contactus@123legal.com</p>
                  <p><strong>{t('Phone:')}</strong> 8668004454</p>
                  
              </div>
              
    
      
  
                  
              
             
              <div className='Footer_col'>
                  <h5>{t('Follow Us')}</h5>
                  <ul className="list-unstyled">
                      <li><a href="https://www.linkedin.com/company/ideelit" target="_blank" rel="noopener noreferrer"> 
                      <img src={linkedin} alt="linkedin" />
                      </a></li>
                      <li><a href="https://www.facebook.com/ideelit" target="_blank" rel="noopener noreferrer"><img src={facebook} alt="facebook" /></a></li>
                      <li><a href="https://twitter.com/ideelit" target="_blank" rel="noopener noreferrer"><img src={twitter} alt="twitter" /></a></li>
                  </ul>
              </div>
          </div>
          <Container fluid className="Footer-copyright">
              <Row>
                  <Col className='copyfoot' style={{ textAlign: 'center' }}>
                      <p >{t('Copyright; 2024. Ideelit.com. All Rights Reserved')}</p>
                      <div className='version' style={{textAlign:'start'}}>
                      <h5>{t('Version')} : 24.02.24</h5>
                      </div>
                  </Col>
              </Row>
          </Container>
      </footer>
    )
  }
export default Footer;