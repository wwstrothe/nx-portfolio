import {
  colors,
  spacing,
  typography,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  palette,
  semantic,
  space,
  sizing,
  border,
  elevation,
  motion,
  layers,
  opacity,
  components,
} from './design-tokens';

describe('design-tokens exports', () => {
  it('colors should include primary blue', () => {
    expect(colors.primary).toBe('#2563eb');
    expect(colors.gray[900]).toBe('#111827');
  });

  it('spacing and space scales should align', () => {
    expect(spacing.md).toBe('1rem');
    expect(space[16]).toBe('1rem');
  });

  it('typography font sizes are defined', () => {
    expect(typography.fontSize.md).toBe('1rem');
    expect(typography.fontWeight.bold).toBe(700);
  });

  it('zIndex and layers should include modal', () => {
    expect(zIndex.modal).toBe(1050);
    expect(layers.modal).toBe(1050);
  });

  it('breakpoints should be defined and consistent', () => {
    expect(breakpoints.sm).toBe('640px');
    expect(breakpoints.md).toBe('768px');
    expect(breakpoints.lg).toBe('1024px');
    expect(breakpoints.xl).toBe('1280px');
    expect(breakpoints['2xl']).toBe('1536px');

    // sizing.container should reference the same breakpoint values
    expect(sizing.container.sm).toBe(breakpoints.sm);
    expect(sizing.container.md).toBe(breakpoints.md);
    expect(sizing.container.lg).toBe(breakpoints.lg);
    expect(sizing.container.xl).toBe(breakpoints.xl);
    expect(sizing.container.xxl).toBe(breakpoints['2xl']);
  });

  it('palette semantic links are correct', () => {
    expect(palette.blue[600]).toBe(colors.primary);
    expect(semantic.primary).toBe(colors.primary);
  });

  it('sizing helpers include icon sizes', () => {
    expect(sizing.icon.md).toBe('20px');
  });

  it('elevation aliases shadows', () => {
    expect(elevation.lg).toBe(shadows.lg);
  });

  it('motion contains base transition', () => {
    expect(motion.transition.base).toContain(transitions.base);
  });

  it('component tokens reference core tokens', () => {
    expect(components.button.bg).toBe(colors.primary);
    expect(components.footer.paddingY.base).toBe(spacing.md);
    expect(border.width.hairline).toBe('1px');
  });

  it('opacity presets exist', () => {
    expect(opacity.overlay).toBeGreaterThan(0);
    expect(opacity.disabled).toBeLessThan(opacity.overlay);
  });
});
