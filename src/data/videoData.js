const videos = Array.from({ length: 24 }).map((_, i) => ({
id: String(1000 + i),
title: `Sample Video Title ${i + 1}`,
channel: `Channel ${i % 6 + 1}`,
views: Math.floor(Math.random() * 2000000),
uploaded: `${Math.floor(Math.random() * 12) + 1} days ago`,
duration: `${Math.floor(Math.random() * 20) + 2}:00`,
thumbnail: `https://picsum.photos/seed/${i + 1}/480/270`,
avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
description: `This is a sample description for video ${i + 1}.`
}))


export default videos