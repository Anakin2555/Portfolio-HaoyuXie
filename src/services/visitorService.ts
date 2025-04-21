import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Visitor } from '../types';

class VisitorService {
  private static fpPromise = FingerprintJS.load();

  // 获取设备指纹
  static async getDeviceFingerprint(): Promise<string> {
    const fp = await this.fpPromise;
    const result = await fp.get();
    return result.visitorId;
  }

  // 生成简短的访客名称
  private static generateVisitorName(deviceId: string): string {
    // 方法1：使用设备ID的前6位作为基础，并添加随机字母
    // const generateShortName = () => {
    //   const prefix = 'visitor';
    //   const shortId = deviceId.slice(0, 6);  // 取前6位
    //   const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    //   return `${prefix}_${randomChar}${shortId}`;
    // };

    // 方法2：使用Base62编码（更简短）
    const generateBase62Name = () => {
      const base62chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const hash = deviceId.split('').reduce((acc, char) => {
        return (acc * 31 + char.charCodeAt(0)) >>> 0;
      }, 0);
      
      let name = '';
      let num = hash;
      while (num > 0) {
        name = base62chars[num % 62] + name;
        num = Math.floor(num / 62);
      }
      return `v_${name.slice(0, 8)}`; // 限制长度为8个字符
    };

    // 方法3：使用时间戳和随机数组合
    // const generateTimedName = () => {
    //   const timestamp = Date.now().toString(36); // 转换为36进制
    //   const random = Math.random().toString(36).substring(2, 5); // 3位随机字符
    //   return `v_${timestamp.slice(-4)}${random}`;
    // };

    // 使用方法2（Base62）作为默认方法，因为它产生的名称较短且唯一性高
    return generateBase62Name();
  }

  // 获取或创建访客身份
  static async getVisitorIdentity(): Promise<Visitor> {
    try {
      // 获取设备指纹
      const deviceId = await this.getDeviceFingerprint();
      
      // 获取IP地址和位置信息   
      const ipResponse = await fetch('https://ipapi.co/json/', {
        mode: 'no-cors',
        headers: {
          'Accept': 'application/json'
        }
      });
      const ipData = await ipResponse.json();
      
      const visitor: Visitor = {
        deviceId,
        name: this.generateVisitorName(deviceId),
        ip: ipData.query,
        location: {
          city: ipData.city,
          region: ipData.regionName,
          country: ipData.country,
          timezone: ipData.timezone
        },
        userAgent: navigator.userAgent,
        lastVisit: new Date().toISOString()
      };

      console.log(visitor);
      

    //   // 将访客信息存储到后端
    //   const response = await fetch('/api/visitors', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(visitor)
    //   });

    //   return await response.json();
        return visitor;


    } catch (error) {
      console.error('Error getting visitor identity:', error);
      throw error;
    }
  }
}

export default VisitorService; 