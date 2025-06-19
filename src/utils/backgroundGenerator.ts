
export const generateContextualBackground = (ctx: CanvasRenderingContext2D, title: string, width: number, height: number, backgroundColor: string) => {
  const keywords = title.toLowerCase().split(' ');
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, backgroundColor);
  gradient.addColorStop(0.5, `${backgroundColor}90`);
  gradient.addColorStop(1, `${backgroundColor}70`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  if (keywords.some(word => ['phá', 'dỡ', 'nhà', 'cũ', 'xây', 'dựng', 'công', 'trình', 'múc', 'đập', 'phá'].includes(word))) {
    drawConstructionBackground(ctx, width, height, backgroundColor);
  } else if (keywords.some(word => ['technology', 'tech', 'ai', 'artificial', 'intelligence', 'digital', 'software', 'programming', 'code', 'computer', 'data', 'công', 'nghệ', 'phần', 'mềm'].includes(word))) {
    drawTechBackground(ctx, width, height);
  } else if (keywords.some(word => ['business', 'finance', 'marketing', 'sales', 'money', 'profit', 'corporate', 'company', 'management', 'kinh', 'doanh', 'tài', 'chính', 'tiền'].includes(word))) {
    drawBusinessBackground(ctx, width, height);
  } else if (keywords.some(word => ['design', 'creative', 'art', 'ui', 'ux', 'graphics', 'visual', 'aesthetic', 'beauty', 'style', 'thiết', 'kế', 'nghệ', 'thuật'].includes(word))) {
    drawCreativeBackground(ctx, width, height);
  } else if (keywords.some(word => ['travel', 'journey', 'adventure', 'explore', 'world', 'destination', 'vacation', 'trip', 'du', 'lịch', 'khám', 'phá'].includes(word))) {
    drawTravelBackground(ctx, width, height);
  } else if (keywords.some(word => ['food', 'cooking', 'recipe', 'kitchen', 'chef', 'restaurant', 'eat', 'delicious', 'taste', 'ăn', 'nấu', 'món', 'ẩm', 'thực'].includes(word))) {
    drawFoodBackground(ctx, width, height);
  } else if (keywords.some(word => ['xe', 'ô', 'tô', 'car', 'auto', 'vehicle', 'driving', 'road', 'transport', 'giao', 'thông'].includes(word))) {
    drawAutomotiveBackground(ctx, width, height);
  } else if (keywords.some(word => ['học', 'giáo', 'dục', 'education', 'school', 'university', 'student', 'learning', 'study', 'knowledge'].includes(word))) {
    drawEducationBackground(ctx, width, height);
  } else {
    drawDefaultBackground(ctx, width, height);
  }
};

const drawConstructionBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, backgroundColor: string) => {
  ctx.save();
  ctx.globalAlpha = 0.4;
  
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 8; i++) {
    const x = (width / 8) * i;
    const buildingWidth = width / 10;
    const buildingHeight = Math.random() * height * 0.3 + 100;
    ctx.fillRect(x, height - buildingHeight, buildingWidth, buildingHeight);
    
    ctx.fillStyle = backgroundColor;
    for (let row = 0; row < Math.floor(buildingHeight / 40); row++) {
      for (let col = 0; col < 3; col++) {
        const windowX = x + col * (buildingWidth / 4) + 10;
        const windowY = height - buildingHeight + row * 40 + 10;
        ctx.fillRect(windowX, windowY, 15, 15);
      }
    }
    ctx.fillStyle = '#ffffff';
  }
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.beginPath();
  const craneX = width * 0.7;
  ctx.moveTo(craneX, height - 50);
  ctx.lineTo(craneX, height * 0.3);
  ctx.lineTo(craneX + width * 0.25, height * 0.3);
  ctx.stroke();
  
  ctx.fillStyle = '#ffffff';
  const excavatorX = width * 0.2;
  const excavatorY = height - 80;
  ctx.fillRect(excavatorX, excavatorY, 80, 40);
  ctx.fillRect(excavatorX + 20, excavatorY - 30, 40, 30);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(excavatorX + 60, excavatorY - 15);
  ctx.lineTo(excavatorX + 120, excavatorY - 40);
  ctx.lineTo(excavatorX + 140, excavatorY - 20);
  ctx.stroke();
  
  ctx.restore();
};

const drawTechBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.globalAlpha = 0.3;
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const endX = startX + (Math.random() - 0.5) * 200;
    const endY = startY + (Math.random() - 0.5) * 200;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
};

const drawBusinessBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.globalAlpha = 0.25;
  
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 12; i++) {
    const x = (width / 12) * i + 20;
    const barHeight = Math.random() * height * 0.4 + 50;
    const barWidth = width / 20;
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
  }
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(50, height - 100);
  for (let i = 1; i < 10; i++) {
    const x = (width / 10) * i;
    const y = height - 100 - Math.random() * 200;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  
  ctx.restore();
};

const drawCreativeBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.globalAlpha = 0.2;
  
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 100 + 50;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.bezierCurveTo(
      Math.random() * width, Math.random() * height,
      Math.random() * width, Math.random() * height,
      Math.random() * width, Math.random() * height
    );
    ctx.stroke();
  }
  
  ctx.restore();
};

const drawTravelBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.globalAlpha = 0.3;
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (let i = 0; i < width; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
  for (let i = 0; i < height; i += 50) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }
  
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
};

const drawFoodBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.globalAlpha = 0.25;
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 60 + 30;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.restore();
};

const drawAutomotiveBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.globalAlpha = 0.3;
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  for (let i = 0; i < 5; i++) {
    const y = height * 0.6 + i * 20;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 4; i++) {
    const x = (width / 4) * i + 50;
    const y = height * 0.7;
    ctx.fillRect(x, y, 80, 30);
    ctx.fillRect(x + 15, y - 20, 50, 20);
    ctx.beginPath();
    ctx.arc(x + 20, y + 30, 10, 0, Math.PI * 2);
    ctx.arc(x + 60, y + 30, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
};

const drawEducationBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.globalAlpha = 0.3;
  
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 6; i++) {
    const x = Math.random() * width;
    const y = height - 50 - i * 15;
    ctx.fillRect(x, y, 60, 12);
  }
  
  ctx.fillStyle = '#ffffff';
  const capX = width * 0.8;
  const capY = height * 0.3;
  ctx.fillRect(capX - 30, capY, 60, 8);
  ctx.fillRect(capX - 15, capY - 20, 30, 20);
  
  ctx.restore();
};

const drawDefaultBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.save();
  ctx.globalAlpha = 0.2;
  
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 80 + 20;
    
    if (Math.random() > 0.5) {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(x, y, size, size * 0.7);
    }
  }
  
  ctx.restore();
};
