import dayjs, { type Dayjs, type PluginFunc } from 'dayjs';

/**
 * Create a new instance of Day.js with plugins.
 * @param {Date | string | number} date - The date to parse.
 * @param {PluginFunc[]} plugins - The plugins to extend Day.js with.
 * @returns {Dayjs} A new instance of Day.js with the provided plugins.
 */
export const dayjsWithPlugins = (
  date: Date | string | number,
  // biome-ignore lint/suspicious/noExplicitAny: Day.js plugins have different types.
  plugins: PluginFunc<any>[],
): Dayjs => {
  for (const plugin of plugins) {
    dayjs.extend(plugin);
  }

  return dayjs(date);
};
