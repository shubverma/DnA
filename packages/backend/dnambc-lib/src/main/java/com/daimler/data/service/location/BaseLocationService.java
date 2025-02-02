/* LICENSE START
 * 
 * MIT License
 * 
 * Copyright (c) 2019 Daimler TSS GmbH
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * LICENSE END 
 */

package com.daimler.data.service.location;

import com.daimler.data.assembler.LocationAssembler;
import com.daimler.data.db.entities.LocationNsql;
import com.daimler.data.db.repo.location.LocationCustomRepository;
import com.daimler.data.db.repo.location.LocationRepository;
import com.daimler.data.dto.location.LocationVO;
import com.daimler.data.service.common.BaseCommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BaseLocationService
        extends BaseCommonService<LocationVO, LocationNsql, String>
        implements LocationService {

    @Autowired
    private LocationCustomRepository customRepo;
    @Autowired
    private LocationRepository jpaRepo;
    @Autowired
    private LocationAssembler algoAssembler;

    public BaseLocationService() {
        super();
    }

//    @Autowired
//    public BaseLocationService(LocationCustomRepository customRepo
//            , LocationRepository jpaRepo
//            , LocationAssembler algoAssembler) {
//        super(customRepo, jpaRepo, algoAssembler);
//        this.customRepo = customRepo;
//        this.jpaRepo = jpaRepo;
//        this.algoAssembler = algoAssembler;
//    }




}
