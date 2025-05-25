fetch('image_list.json')
  .then(res => res.json())
  .then(imageUrls => {
    const container = document.getElementById('cards');
    imageUrls.forEach(url => {
      const card = document.createElement('div');
      card.className = 'card';

      const img = document.createElement('img');
      img.src = url;
      img.alt = '';

      const title = document.createElement('h1');
      id = url.split('\\')[1].split('-')[0]
    //   title.textContent = id

      const link = document.createElement('a');
      link.textContent = id
      link.href = `https://rebrickable.com/parts/${id}`
      link.target = "_blank"
      title.appendChild(link)


      card.appendChild(img);
      card.appendChild(title);
    //   card.appendChild(link);
      container.appendChild(card);
    });
  });
