/**
 * kmp 算法
 * 在字符串匹配中的应用
 * 构造 next 数组，用于在非匹配位置减少回退量
 */
/**
 *  a b e a b a b
 *  a b e a b f // 此时不匹配但可以退到子串的 a b 位置 
 */
/**
 * 构造 next 数组，即构造子串不同位置时的前缀和后缀时的对应索引
 */

 function getNext (str) {
    const map = []
    map[0] = 0
    for(let j = 0, i = 1; i < str.length;) {
        if (str[i] === str[j]) {
            map[i] = j + 1
            i+=1
            j+=1
        } else {
            while(str[j] !== str[i] && j !== 0) {
                j = map[j -1]
            }
            if (str[j] === str[i]) {
                map[i] = j + 1
                i+=1
                j+=1
            } else {
                map[i] = 0
                i += 1
            }
        }
    }
    return map
}
/**
 * 1. 遍历，增加子串长度
 * 2. 比较结尾和开始是否相同
 */
function getNext (str) {
    // 0 代表不匹配，所以后续 next[j]的值要加 1，不然 0 会有两个意思
    let next = [0]
    for(let i = 0, j = 1; j < str.length;) {
        // 如果相等，后续进行子串对比时可退回子串此可比较位置
        if (str[j] === str[i]) {
            next[j] = i + 1
            i++
            j++
        } else {
            while(i !== 0 && str[i] !== str[j]) {
                // 不相等则回退到前面部分后缀对应的前缀的末尾的可比较位置，直到开始位置
                // abcdabce
                // 0000123? -> abc? 索引3继续比较 e !== d 回退至0
                i = next[i - 1]
            }
            if (str[j] === str[i]) {
                next[j] = i + 1
                i++
                j++
            } else {
                next[j] = 0
                j++
            }
        }
    }
    return next
}