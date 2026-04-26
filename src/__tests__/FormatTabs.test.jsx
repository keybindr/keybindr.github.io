import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TranslationContext } from '../useTranslation';
import { makeT } from '../useTranslation';
import FormatTabs from '../components/FormatTabs';

const t = makeT('en-US');

function renderTabs(props) {
  return render(
    <TranslationContext.Provider value={t}>
      <FormatTabs {...props} />
    </TranslationContext.Provider>,
  );
}

const TWO_FORMATS = [
  { name: 'On Foot',   bindings: [], keyColors: {}, mouseBindings: [], hotasBindings: [] },
  { name: 'In Vehicle', bindings: [], keyColors: {}, mouseBindings: [], hotasBindings: [] },
];

function defaultProps(overrides = {}) {
  return {
    formats: TWO_FORMATS,
    activeIndex: 0,
    onSwitch: vi.fn(),
    onAdd:    vi.fn(),
    onRename: vi.fn(),
    onRemove: vi.fn(),
    ...overrides,
  };
}

describe('FormatTabs — rendering', () => {
  it('renders a tab for each format', () => {
    renderTabs(defaultProps());
    expect(screen.getByText('On Foot')).toBeInTheDocument();
    expect(screen.getByText('In Vehicle')).toBeInTheDocument();
  });

  it('shows the add button when under the format limit', () => {
    renderTabs(defaultProps());
    expect(screen.getByTitle(t('tabAdd'))).toBeInTheDocument();
  });

  it('does not show the remove button on the first tab', () => {
    renderTabs(defaultProps());
    // Only the second tab should have a remove button
    const removes = screen.queryAllByTitle(t('tabRemove'));
    expect(removes).toHaveLength(1);
  });

  it('shows the remove button on all non-first tabs', () => {
    const threeFormats = [
      ...TWO_FORMATS,
      { name: 'In Air', bindings: [], keyColors: {}, mouseBindings: [], hotasBindings: [] },
    ];
    renderTabs(defaultProps({ formats: threeFormats }));
    expect(screen.getAllByTitle(t('tabRemove'))).toHaveLength(2);
  });
});

describe('FormatTabs — interaction', () => {
  it('clicking an inactive tab calls onSwitch with its index', async () => {
    const user = userEvent.setup();
    const onSwitch = vi.fn();
    renderTabs(defaultProps({ onSwitch }));
    await user.click(screen.getByText('In Vehicle'));
    expect(onSwitch).toHaveBeenCalledWith(1);
  });

  it('clicking the active tab enters inline rename mode', async () => {
    const user = userEvent.setup();
    renderTabs(defaultProps());
    await user.click(screen.getByText('On Foot'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('pressing Enter in the rename input commits the new name', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    renderTabs(defaultProps({ onRename }));
    await user.click(screen.getByText('On Foot'));
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Renamed Tab');
    await user.keyboard('{Enter}');
    expect(onRename).toHaveBeenCalledWith(0, 'Renamed Tab');
  });

  it('pressing Escape in the rename input cancels without committing', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    renderTabs(defaultProps({ onRename }));
    await user.click(screen.getByText('On Foot'));
    // The input renders via state update; focus it explicitly before firing keys
    // (the useEffect-driven select() is async relative to the click await).
    screen.getByRole('textbox').focus();
    await user.keyboard('{Escape}');
    expect(onRename).not.toHaveBeenCalled();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('clicking the remove button calls onRemove with the tab index', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderTabs(defaultProps({ onRemove }));
    await user.click(screen.getByTitle(t('tabRemove')));
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('clicking the add button calls onAdd', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    renderTabs(defaultProps({ onAdd }));
    await user.click(screen.getByTitle(t('tabAdd')));
    expect(onAdd).toHaveBeenCalledOnce();
  });
});
