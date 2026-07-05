export type RemoteKey =
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "ArrowDown"
  | "Enter"
  | "Backspace"
  | "Escape"
  | string;

export function moveFocus(
  currentIndex: number,
  key: RemoteKey,
  itemCount: number,
  columns: number,
): number {
  if (itemCount <= 0) {
    return 0;
  }

  const safeIndex = Math.min(Math.max(currentIndex, 0), itemCount - 1);

  if (columns >= itemCount) {
    if (key === "ArrowLeft") {
      return (safeIndex - 1 + itemCount) % itemCount;
    }

    if (key === "ArrowRight") {
      return (safeIndex + 1) % itemCount;
    }

    return safeIndex;
  }

  const columnCount = Math.max(1, columns);
  const column = safeIndex % columnCount;

  if (key === "ArrowLeft") {
    return column === 0 ? safeIndex : safeIndex - 1;
  }

  if (key === "ArrowRight") {
    const nextIndex = safeIndex + 1;
    return column === columnCount - 1 || nextIndex >= itemCount
      ? safeIndex
      : nextIndex;
  }

  if (key === "ArrowUp") {
    return Math.max(0, safeIndex - columnCount);
  }

  if (key === "ArrowDown") {
    return Math.min(itemCount - 1, safeIndex + columnCount);
  }

  return safeIndex;
}

export function isSelectKey(key: RemoteKey): boolean {
  return key === "Enter";
}

export function isBackKey(key: RemoteKey): boolean {
  return key === "Escape" || key === "Backspace";
}
