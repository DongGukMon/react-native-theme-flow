import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';
import { ThemeFlow } from './theme';

export const ThemeButton = ({
  selected,
  type,
  onPress,
}: {
  selected: boolean;
  type: 'dark' | 'light';
  onPress: () => void;
}) => {
  const name = type === 'dark' ? 'moon' : 'sunny';
  const styles = s.use();

  return (
    <Pressable style={styles.container({ selected })} onPress={onPress}>
      <Ionicons name={name} style={styles.icon} />
    </Pressable>
  );
};

const s = ThemeFlow.create(({ theme }) => ({
  container: (params: { selected: boolean }) => ({
    borderRadius: 100,
    borderColor: theme.colors.counter,
    borderWidth: params.selected ? 2 : 0,
    padding: 24,
  }),
  icon: {
    color: theme.colors.counter,
    fontSize: 80,
  },
}));
