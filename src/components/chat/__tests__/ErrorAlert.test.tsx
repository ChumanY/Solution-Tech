import { render, screen } from '@testing-library/react';
import ErrorAlert from '../ErrorAlert';

describe('ErrorAlert', () => {
  it('muestra el mensaje de error cuando fileError existe', () => {
    render(<ErrorAlert fileError="Error de archivo" alertVisible={true} />);
    expect(screen.getByText('Error de archivo')).toBeInTheDocument();
  });

  it('no muestra nada si fileError está vacío', () => {
    render(<ErrorAlert fileError="" alertVisible={true} />);
    expect(screen.queryByText('Error de archivo')).not.toBeInTheDocument();
  });
});
