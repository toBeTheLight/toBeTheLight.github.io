var reachingPoints = function(sx, sy, tx, ty) {
  while(true) {
    if (tx === sx && ty === sy) return true
    if (tx < sx || ty < sy) return false
    if (tx > ty) {
      if ((tx - sx) % ty === 0) return true
      if (tx/ty > 2) {
        tx = ty + (tx%ty)
      } else {
        tx -= ty
      }
    } else if (ty > tx) {
      if ((ty - sy) % tx === 0) return true
      if (ty/tx > 2) {
        ty = tx + (ty%tx)
      } else {
        ty -= tx
      }
    } else {
      return false
    }
    console.log(tx,ty)
  }
};
console.log(
  reachingPoints(1
    ,18
    ,999999992
    ,18)
)