import { render, screen, fireEvent } from '@testing-library/react';
import ChatSearch from '../ChatSearch';

describe('ChatSearch', () => {
  it('renderiza el input y actualiza el valor', () => {
    const setSearch = jest.fn();
    render(<ChatSearch search="" setSearch={setSearch} />);
    const input = screen.getByPlaceholderText('Buscar...');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'mision' } });
    expect(setSearch).toHaveBeenCalledWith('mision');
  });
});
