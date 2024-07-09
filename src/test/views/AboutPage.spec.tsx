import AboutPage from '../../views/AboutPage';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import TeamCard from '../../components/TeamCard';
import ErrorPage from '../../views/ErroPage';
import '@testing-library/jest-dom';


jest.mock('../../components/SectionHeader', () => ({ title }: { title: string }) => <h1>{title}</h1>);
jest.mock('../../components/TeamCard', () => ({ name, title }: { name: string, title: string }) => <div>{name} - {title}</div>);
jest.mock('../../components/servicesSection', () => () => <div>ServicesSection</div>);
jest.mock('react-icons/io5', () => ({ IoCheckmarkDoneOutline: () => <span>CheckIcon</span> }));

describe('AboutPage', () => {
  beforeEach(() => {
    render(<AboutPage />);
  });

  test('renders the About Us section header', () => {
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  test('renders the main heading', () => {
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  test('renders the check items', () => {
    expect(screen.getByText('100+ Dedicated Customers')).toBeInTheDocument();
    expect(screen.getByText('24/7 customer support')).toBeInTheDocument();
    expect(screen.getByText('100+ Customer satisfaction')).toBeInTheDocument();
  });

  test('renders three images', () => {
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  test('renders the ServicesSection component', () => {
    expect(screen.getByText('ServicesSection')).toBeInTheDocument();
  });

  test('renders the Meet the team section header', () => {
    expect(screen.getByText('Meet the team')).toBeInTheDocument();
  });

  test('renders six TeamCard components', () => {
    const teamMembers = [
      'Gatete Angelo Christian - Software Developer',
      'Eric Niyokwizerwa - Software Developer',
      'Yvan David - Software Developer',
      'Sosthen Bananayo - Software Developer',
      'Athos Mpano - Software Developer',
      'Justine Furaha - Software Developer'
    ];

    teamMembers.forEach(member => {
      expect(screen.getByText(member)).toBeInTheDocument();
    });
  });
});


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../components/Button', () => ({ value, onClick }: { value: string; onClick: () => void }) => (
  <button onClick={onClick}>{value}</button>
));

jest.mock('react-icons/im', () => ({
  ImSad: () => <div data-testid="sad-icon">Sad Icon</div>,
}));

describe('ErrorPage', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );
  });

  test('renders the sad icon', () => {
    expect(screen.getByTestId('sad-icon')).toBeInTheDocument();
  });

  test('renders the error message', () => {
    expect(screen.getByText("Sorry, we can’t seem to find your page")).toBeInTheDocument();
  });

  test('renders the "Go Back" button', () => {
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  test('renders the "Home" button', () => {
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  test('calls navigate(-1) when "Go Back" button is clicked', () => {
    fireEvent.click(screen.getByText('Go Back'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('calls navigate("/") when "Home" button is clicked', () => {
    fireEvent.click(screen.getByText('Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

// ================================================


jest.mock('react-icons/fi', () => ({
  FiGithub: () => <div data-testid="github-icon">Github Icon</div>,
}));

jest.mock('react-icons/fa', () => ({
  FaLinkedinIn: () => <div data-testid="linkedin-icon">LinkedIn Icon</div>,
}));


describe('TeamCard with missing props', () => {
  test('renders without crashing when props are missing', () => {
    render(
      <Router>
        <TeamCard />
      </Router>
    );
  });
});