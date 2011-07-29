function(doc) {
  if (doc.currency) {
      emit(doc.currency, {price: doc.price, volume: doc.volume, count: 1});
  }
}
