export function addFrameMask(ctx, x, y, w, h, size, color) {
  var style;
  //   const { setLinearStyle, setRadialStyle } = this;
  style = setLinearStyle(ctx, x + size, y + size, x + size, y, color);
  ctx.fillStyle = style;
  ctx.fillRect(x + size, y, w - size * 2, size);

  style = setRadialStyle(
    ctx,
    x + size,
    y + size,
    0,
    x + size,
    y + size,
    size,
    color
  );
  ctx.fillStyle = style;
  ctx.fillRect(x, y, size, size);

  style = setLinearStyle(ctx, x + size, y + size, x, y + size, color);
  ctx.fillStyle = style;
  ctx.fillRect(x, y + size, size, h - size * 2);

  style = setRadialStyle(
    ctx,
    x + size,
    y + h - size,
    0,
    x + size,
    y + h - size,
    size,
    color
  );
  ctx.fillStyle = style;
  ctx.fillRect(x, y + h - size, size, size);

  style = setLinearStyle(ctx, x + size, y + h - size, x + size, y + h, color);
  ctx.fillStyle = style;
  ctx.fillRect(x + size, y + h - size, w - size * 2, size);

  style = setRadialStyle(
    ctx,
    x + w - size,
    y + h - size,
    0,
    x + w - size,
    y + h - size,
    size,
    color
  );
  ctx.fillStyle = style;
  ctx.fillRect(x + w - size, y + h - size, size, size);

  style = setLinearStyle(ctx, x + w - size, y + size, x + w, y + size, color);
  ctx.fillStyle = style;
  ctx.fillRect(x + w - size, y + size, size, h - size * 2);

  style = setRadialStyle(
    ctx,
    x + w - size,
    y + size,
    0,
    x + w - size,
    y + size,
    size,
    color
  );
  ctx.fillStyle = style;
  ctx.fillRect(x + w - size, y, size, size);
}

export function setRadialStyle(ctx, x1, y1, r1, x2, y2, r2, color) {
  var tmp = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
  tmp.addColorStop(0, "rgba(" + color + "," + color + "," + color + ", 0)");
  tmp.addColorStop(1, "rgba(" + color + "," + color + "," + color + ", 1)");
  return tmp;
}

export function setLinearStyle(ctx, x1, y1, x2, y2, color) {
  var tmp = ctx.createLinearGradient(x1, y1, x2, y2);
  tmp.addColorStop(0, "rgba(" + color + "," + color + "," + color + ", 0)");
  tmp.addColorStop(1, "rgba(" + color + "," + color + "," + color + ", 1)");
  return tmp;
}
